const {ipcRenderer, remote} = require('electron');
const io = require('socket.io-client');

const {getList, listenList, dispatchTask, endTask} = require("../store");
const {imageCall, fetch, request, makeIcon} = require("../utils");
const Upload = require("../Upload");
const Icon = require("../Icon");

const card = require("../templates/card");

const {PlaylistItem} = require('./PlaylistItem');

class Playlist extends HTMLElement {
  get url() {return this.getAttribute('url')}
  set url(url) {this.setAttribute('url', url)}
  get selectedCards() {return document.querySelectorAll('[selected=true]')}
  constructor() {
    super();
    imageCall(this.getAttribute("url"));
    this.filterOption = {};
    this.socket = io('http://'+this.url+'/playlist');
    this.socket.on('disconnect', () => {
      // errorBox = errorHandler("danger","Déconnecté.",-1);
    });
    this.socket.on('disconnected',() => {
      // errorHandler('danger','Socket Disconnected!')
    })
    this.socket.on('connect',() => {
      // if(errorBox){ errorBox.remove();errorBox = null;}
      this.socket.emit("get");
    })
    this.socket.on("current", (data) => {
      if(this.current && this.current != data.name) {
        this.current = data.name;
        this.update();
      }
    });
    this.listenCardChange();
  }
  connectedCallback(){
    const url = this.getAttribute("url");
    if (! url){
      this.innerHTML = "<h1>Error : no playlist URL</h1>"
      return;
    }
    this.innerHTML = `<div style="margin-left: 50%;"><load-spinner id="playlist-spinner" active ></load-spinner></div>`
    if (!this.getAttribute("url")){
      console.warn("Can't update product's playlist : No valid URL", this);
    }
    //console.log("Fetching playlist on : ",target);
    this.updatePlaylist();
  }
  listenCardChange() {
    document.addEventListener('cardchange', (evt) => {
      const elem = evt.detail.elem;
      switch(evt.detail.action) {
          case 'current':
            if(this.current && evt.detail.value == 'true') {
              this.current = elem.name;
              this.playItem(elem);
            }
            break;
          case 'hidden':
            this.removeItem(elem);
            break;
          case 'active':
            if(evt.detail.oldValue != null) {
              this.toggleActiveItem(elem);
            }
            break;
      }
    })
  }
  absoluteUrl(path, attributes){
    return url.format({
      protocol: 'http',
      hostname: this.getAttribute("url"),
      pathname: path,
      port: 3000,
      query: attributes
    })
  }
  async update(){
    this.updateToolbar();
    this.updateCurrent();
  }
  async requestUpdate(method, targetPath, body){
    let opts = {};
    dispatchTask(targetPath);
    if (typeof body === "object"){
      opts.json = body;
    }
    let options = {
      port: 3000,
      host: this.getAttribute("url"),
      path: encodeURI(targetPath),
      method: method.toUpperCase()
    }
    try {
      let res = await request(options, opts.json ? JSON.stringify(opts.json) : null);
      if(res.statusCode === 200) {
        await this.update();
        endTask(targetPath)
      } else {
        endTask(targetPath, new Error(`${options.method}: ${options.host}:${options.port}/${options.path} - (${res.statusCode}) ${res.statusMessage}`));
      }
    } catch(err) {
      endTask(targetPath, err);
    }
  }
  select(elem) {
    elem.select();
    elem.render();
  }
  unselect(elem) {
    elem.unselect();
    elem.render();
  }
  upload() {
    console.log("UPLOADER changed");
    this.updatePlaylist();
  }
  async updatePlaylist() {
    const opt = {
      port: 3000,
      host: this.getAttribute("url"),
      path: "/playlist",
    }
    const options = {
      port: 3000,
      host: this.getAttribute("url"),
      path: "/control/current",
    }
    let r = ""
    try {
      let res = await fetch(opt);
      r = JSON.parse(res);
    } catch(e) {
      if (e.type != 'invalid-json'){
        console.warn("Invalid response : ",e);
      }
      r = [];
    }
    this.render(r);
    let e = await fetch(options)
    let elem = document.getElementById(decodeURIComponent(escape(JSON.parse(e).name)));
    elem.current = 'true';
    console.log(elem);
    this.updateCurrent();
    this.current = decodeURIComponent(escape(JSON.parse(e).name));
  }
  updateCurrent() {
    let currentMedia = document.querySelectorAll("h-item[current='true']");
    for(let c of currentMedia) {
      if(this.current && c && c.name != this.current) {
        c.current = 'false';
        c.render();
      }
    }
    let item = document.getElementById(this.current);
    if(item) {
      item.render();
    } else {
      document.querySelector("h-item[current=true]").render();
    }
  }
  updateToolbar(elem) {
    let toolbar = document.querySelector(".mdc-top-app-bar__section--align-end");
    while(toolbar.firstChild) {
      toolbar.removeChild(toolbar.firstChild);
    }
    if(this.selectedCards.length == 1) {
      let playButton = Object.assign(document.createElement("a"), {
          className: "play-menu material-icons mdc-top-app-bar__action-item",
          title: `lance directement le média sélectionné`,
          onclick: this.selectedCards[0].play.bind(this.selectedCards[0], this.selectedCards[0]),
        }
      );
      let playIcon = new Icon("play");
      playButton.appendChild(playIcon);
      toolbar.appendChild(playButton);
    }
    if(this.selectedCards.length > 0) {
      let removeButton = Object.assign(document.createElement("a"), {
          className: "play-menu material-icons mdc-top-app-bar__action-item",
          title: `supprime définitivement tout les médias sélectionnés`
        }
      );
      removeButton.addEventListener("click", () => {
        elem.forEach((e) => {
          e.remove();
        })
      })
      let removeIcon = new Icon("delete");
      removeButton.appendChild(removeIcon);
      toolbar.appendChild(removeButton);
    }

    let content = document.querySelector("#main-content");
    let tmpFilterOption = {};
    if(toolbar.firstChild) {
      let separator = Object.assign(document.createElement("div"), {
        style: "width: 8px; height: 80%; border-left: 1px solid lightgrey; margin-left: 8px;"
      });
      toolbar.appendChild(separator);
    }

    let closeButton = Object.assign(document.createElement('a'), {
      className: "play-menu material-icons mdc-top-app-bar__action-item",
      title: "valide les filtres sélectionnés"
    });
    closeButton.addEventListener('click', () => {
      toolbar.removeChild(closeButton);
      toolbar.removeChild(validateButton);
      toolbar.appendChild(filterButton);
      content.removeChild(content.firstChild);
    })
    closeButton.appendChild(new Icon('close'));

    let validateButton = Object.assign(document.createElement('a'), {
      className: "play-menu material-icons mdc-top-app-bar__action-item",
      title: "valide les filtres sélectionnés"
    });
    validateButton.addEventListener('click', () => {
      toolbar.removeChild(closeButton);
      toolbar.removeChild(validateButton);
      toolbar.appendChild(filterButton);
      content.removeChild(content.firstChild);
      this.filterOption = tmpFilterOption;
      this.updatePlaylist();
    })
    validateButton.appendChild(new Icon('check'));

    let filterButton = Object.assign(document.createElement("a"), {
      className: "play-menu material-icons mdc-top-app-bar__action-item",
      title: "ouvre le le menu de filtre"
    })
    filterButton.addEventListener("click", () => {
      let filterDiv = Object.assign(document.createElement("div"), {
        id: 'filter-panel',
        style: "width: 100%; display: flex; flex-flow: row nowrap; align-items: center; justify-content: center; min-height: 64px padding: 24px; border-bottom: 1px solid black"
      });
      let title = document.createElement('h3');
      title.innerHTML = "Filtre : ";
      filterDiv.appendChild(title);

      const addOption = (name, proposition) => {
        let div = Object.assign(document.createElement("div"), {
          style: "padding: 16px;"
        });
        div.innerHTML = `
          <div class="mdc-checkbox" style="padding: 0;">
          <input type="checkbox" class="mdc-checkbox__native-control" id="selector_${name}"/>
          <div class="mdc-checkbox__background" style="left: 0; top: 0; width:100%; height: 100%;">
              <svg class="mdc-checkbox__checkmark" viewBox="0 0 24 24">
              <path class="mdc-checkbox__checkmark-path"
                    fill="none"
                    stroke="white"
                    d="M1.73,12.91 8.1,19.28 22.79,4.59"/>
            </svg>
            <div class="mdc-checkbox__mixedmark"></div>
          </div>
        </div>
        <label for="selector_${name}">${name}</label>`;

        let checkbox = div.querySelector(`#selector_${name}`);
        if(this.filterOption[name]) {
          checkbox.checked = true;
        }
        checkbox.addEventListener("change", () => {
          checkbox.checked ? tmpFilterOption[name] = proposition : delete tmpFilterOption[name]
        })

        return div;
      }
      filterDiv.appendChild(addOption("Actif", info => info.active));
      filterDiv.appendChild(addOption("Inactif", info => !info.active));
      content.insertBefore(filterDiv, content.firstChild);
      toolbar.removeChild(filterButton);

      toolbar.appendChild(closeButton);
      toolbar.appendChild(validateButton);
    })
    let filterIcon = new Icon("filter");
    filterButton.appendChild(filterIcon);

    if(document.querySelector('#filter-panel')) {
      toolbar.appendChild(closeButton);
      toolbar.appendChild(validateButton);
    }else if(document.querySelector('h-playlist') && !document.querySelector('#filter-panel')) {
      toolbar.appendChild(filterButton);
    }
  }
  filter(info) {
    if(Object.keys(this.filterOption).length == 0) return true;
    return Object.keys(this.filterOption).reduce((previous, key) => previous || this.filterOption[key](info), false);
  }
  playItem(elem) {
    if(elem.active && elem.current) {
      this.requestUpdate("put", `/control/current/${elem.name}`);
    }
  }
  removeItem(elem) {
    let res = this.requestUpdate("delete", `/medias/${elem.name}`, null);
    if(!res || res instanceof Error) {
      elem.hidden = false;
    }
  }
  toggleActiveItem(elem) {
    let info = {name: elem.name, path: elem.path, rank: elem.rank}
    return this.requestUpdate("put", "/playlist", Object.assign(info,{active:elem.active}));
  }
  render(list){
    let url = this.getAttribute("url");
    //Reset self content.
    while(this.firstChild){
      this.removeChild(this.firstChild);
    }
    let surroundD = document.createElement('div');
    Object.assign(surroundD.style, {'margin-top': '16px', 'overflow-y': 'scroll', 'height': 'calc(100vh - 128px)'})
    let d = document.createElement("div");
    Object.assign(d.style, {'display':"flex", 'flex-wrap':'wrap', "padding-left": "16px", 'padding-right': '16px'});
    surroundD.appendChild(d);

    list.map((l)=>{delete l._id; return l;}).filter(info => this.filter(info)).map((info)=>{
      let elem = Object.assign(new PlaylistItem(),{
        title: decodeURIComponent(escape(info.name)),
        id: decodeURIComponent(escape(info.name)),
        url: this.getAttribute("url"),
        image: `/medias/${decodeURIComponent(escape(info.name))}`,
        name: decodeURIComponent(escape(info.name)),
        active: info.active,
        path: info.path,
        rank: info.rank
      })

      // Selection
      let selector = elem.shadowRoot.querySelector("#selector");
      elem.addEventListener("click", (event) => {
        let selected = document.querySelectorAll("[selected='true']");
        if(selected && selected.length > 0) {
          for(let i = 0; i < selected.length; i++) {
            if(selected[i] != elem || selected.length > 1) {
              this.unselect(selected[i]);
            }
          }
        }
        if(!elem.selected) {
          this.select(elem);
          selector.checked = true;
        } else {
          elem.play();
        }
        this.updateToolbar([info]);
      }, false);

      elem.shadowRoot.querySelector("#selector").addEventListener("click", (event) => {
        if(selector.checked) {
          this.select(elem);
        } else {
          this.unselect(elem);
        }
        this.updateToolbar(document.querySelectorAll("[selected='true']"));
        event.stopPropagation();
      })

      return elem;
    }).forEach((elem)=>{
      d.appendChild(elem);
    });
    //Upload is a neutral web component that just react to clicks. We need to style it a bit
    let button = Object.assign(document.createElement("button"), {
      className: "mdc-fab material-icons",
      title: "Uploader une vidéo",
      style: "position: fixed; bottom: 24px; right: 24px; min-width:56px; min-height:56px; margin-right:12px"
    });
    let ic = new Icon("upload");
    button.appendChild(ic);
    let uploader = new Upload();
    uploader.setAttribute("url", this.getAttribute("url"));
    uploader.classList.add("uploaderButton");
    uploader.style = "visibility: hidden; opacity: 0; transition: visibility 0s linear 0.5s, opacity 0.5s linear";
    uploader.onchange = (evt)=>{
      this.upload();
    }
    uploader.appendChild(button)
    d.appendChild(uploader);
    this.appendChild(surroundD);
    uploader = new Upload(card(`
      .playlist-card{
        background-color:#103040;
        display:flex;
        alignItems:center;
        justifyContent:center;
      }
      .card__title{
        background-color: rgba(0,0,0,0);
      }
      .card__actions{
        display: none;
      }
      `));
    uploader.setAttribute("url", this.getAttribute("url"));
    uploader.classList.add("uploaderCard");
    let uploadIcon = new Icon("upload");
    uploadIcon.setAttribute('icon-style', "width:48;height:48");
    uploadIcon.setAttribute("slot","name");
    uploader.appendChild(uploadIcon);
    uploader.onchange = (evt)=>{
      this.upload();
    }
    d.insertBefore(uploader, d.firstChild);
    surroundD.addEventListener("scroll", () => {
      if(!document.querySelector(".uploaderCard") || !document.querySelector(".uploaderButton")) return;
      let box = document.querySelector(".uploaderCard").getBoundingClientRect();
      let buttonUploader = document.querySelector(".uploaderButton");
      if(box.bottom <= 100) {
        buttonUploader.style.visibility = "visible";
        buttonUploader.style.opacity = "1";
        buttonUploader.transition = null;
        buttonUploader.style['transition-delay'] = "0s";
      } else {
        buttonUploader.style.visibility = "hidden";
        buttonUploader.style.opacity = "0";
        buttonUploader.style.transition = "visibility 0s linear 0.5s, opacity 0.5s linear";
      }
    }, false);
  }
}

module.exports = {Playlist};
