'use strict';
const url = require("url");
const http = require("http");
const app = require('express')();
const proxy = require('http-proxy').createProxyServer();
const p = require('./resolver');
const Upload = require("./Upload");
const Icon = require("./Icon");
const {getList, listenList, dispatchTask, endTask} = require("./store");
const net = require("net");
const {remote} = require('electron')
const {Menu, MenuItem} = remote
const io = require('socket.io-client');

const card = require("./templates/card");
const main = require("./templates/main");
const infos = require("./templates/infos");

let imageOption;

app.listen(3001);
app.get('/image/*', async (req, res) => {
  let image = req.params[0];
  imageOption.path = `/${image}?thumb=true`
  let obj = await fetch(imageOption);
  res.contentType('png');
  res.end(obj, 'binary');
});

function imageCall(url) {
  imageOption = {
    port: 3000,
    host: url
  }
}

function fetch(options) {
  let obj = "";
  return new Promise((resolve, reject) => {
    let req = http.get(options)
    req.on('response', (res) => {
      res.setEncoding('binary');
      res.on('data', (chunk) => {
        obj += chunk;
      })
    })
    req.on('error', (error) => {
      reject(error);
    })
    req.on('close', () => {
      resolve(obj);
    });
  })
}

function request(options, data) {
  let obj = "";
  return new Promise((resolve, reject) => {
    let req = http.request(options)
    req.on('response', (res) => {
      obj = res;
    })
    req.on('error', (error) => {
      reject(error);
    })
    req.on('close', () => {
      resolve(obj);
    });
    if(data) {
      req.setHeader('Content-Type', 'application/json')
      if(data) req.write(data);
    }
    req.end();
  })
}

function makeIcon(name){
  let n = getNode("svg", {fill:"#fff", width: 24, height: 24, viewBox:"0 0 24 24"});
  let u = getNode('use',{})
  u.setAttributeNS('http://www.w3.org/1999/xlink', 'href', `${p("static/icons/combined.svg#icon-"+name
)}`);
  n.appendChild(u);
  return n;
}

//Helper function to create svg partials
function getNode(n, v) {
  n = document.createElementNS("http://www.w3.org/2000/svg", n);
  for (var p in v){
    n.setAttributeNS(null, p, v[p]);
  }
  return n;
}

class Product extends HTMLElement{
  static get observedAttributes() {return ['id']; }
  constructor(){
    super();
    const shadowRoot = this.attachShadow({mode: 'open'})
        .appendChild(main());
  }

  connectedCallback(){
    if (!this.listener){
      this.listener = listenList((evt)=>{
        Product.render(this,evt.detail);
      });
    }
    Product.render(this, getList());
  }
  attributeChangedCallback(){
    Product.render(this, getList());
  }
  static async render(elem, list){
    let infos = list.find((p)=>{
      return p.name == elem.id;
    });

    let addr = infos.addresses[0];
    switch (net.isIP(addr)) {
      case 6:
        addr += `%${infos.networkInterface}`;
        break;
      case 0:
        console.error("Bad IP found");
        break;
      default:
    }

    console.log("name : ",elem.id)
    if (! infos){
      elem.innerHTML = `<h1>Product not found</h1>`;
      return;
    }
    const versionOption = {
      port: 3000,
      host: addr,
      path: "/system/version",
    };
    //Use the template's slot properties
    elem.innerHTML = `
    <span slot="title" title="${infos.addresses.join(", ")}">
      ${infos.name}
    </span>
    <div slot="image">
        <img class="mdc-card__media-item" src="../static/img/1-1.jpg">
    </div>
    <nav slot="tabs" id="basic-tab-bar" class="mdc-tab-bar" role="tablist">
      <a id="content" class="mdc-tab mdc-tab--active">Contenus</a>
      <a id="infos" class="mdc-tab">Infos</a>
      <span class="mdc-tab-bar__indicator"></span>
    </nav>
    <h-playlist class="js-panel" url="${addr}" slot="content"/>
    `;
    document.querySelector("#title").innerHTML = `
      <span title="${infos.addresses.join(", ")}">
        ${infos.name}
      </span>
    `

    let tabs = new mdc.tabs.MDCTabBar(document.querySelector("#basic-tab-bar"));
    tabs.preventDefaultOnClick = true;
    tabs.listen("MDCTabBar:change", async (t) => {
      let tab = t.detail;
      let index = tabs.activeTabIndex;
      let version = await fetch(versionOption)
      let panel = document.querySelector(".js-panel");
      elem.removeChild(panel);
      if(document.getElementById("filter-panel")) {
        console.log("test");
        document.querySelector('#main-content').removeChild(document.getElementById('filter-panel'));
      }
      if(index == 1) {
        let actions = document.querySelector('.mdc-top-app-bar__section--align-end');
        while(actions.firstChild) {
          actions.removeChild(actions.firstChild);
        }

        elem.appendChild(Object.assign(document.createElement('h-infos'), {
          slot: "content",
          classList: ["js-panel"],
          url: addr,
          version: version
        }));
      } else {
        elem.appendChild(Object.assign(document.createElement('h-playlist'), {
          slot: "content",
          classList: ["js-panel"],
          url: addr,
        }))
      }
    })
  }
}

class ProductInfo extends HTMLElement {
  get observedAttributes(){return ["version", "url"]}
  get url() {return this.getAttribute('url')}
  set url(url) {this.setAttribute('url', url)}
  get version() {return this.getAttribute('version')}
  set version(version) {this.setAttribute('version', version)}
  constructor() {
    super();
    let dom = this.attachShadow({mode: 'open'});
    dom.appendChild(infos());
  }
  connectedCallback(){
    this.render();
  }
  attributeChangedCallback(){
    this.render();
  }
  render() {
    const url = this.getAttribute("url");
    const version = this.getAttribute("version");
    this.appendChild(Object.assign(document.createElement('span'), {
      slot: "url",
      textContent: url
    }));
    this.appendChild(Object.assign(document.createElement('span'), {
      slot: "version",
      textContent: version
    }));
  }
}

class PlaylistItem extends HTMLElement {
  get observedAttributes(){return ["name","image","active","rank", "url"]}
  set image(val) {this.setAttribute('image', val)}
  get image() {return this.getAttribute('image')}
  constructor(){
    super();
    let dom = this.attachShadow({mode: 'open'});
    dom.appendChild(card());
  }
  connectedCallback(){
    this.render();
  }
  attributeChangedCallback(){
    this.render();
  }
  render(){
    let img = `http://localhost:3001/image${this.getAttribute("image")}`;
    let dom = this.shadowRoot;
    console.log("image url : ",(img)?img:p("public","img","1-1.jpg"));
    dom.querySelector(".card").style.backgroundImage = (img)? `url(${img})`: `url(../static/img/1-1.jpg)`;
    if(this.classList.contains("is-selected")) {
      this.shadowRoot.querySelector(".card__title").style = "background-color: var(--mdc-theme-secondary);"
    } else {
      this.shadowRoot.querySelector(".card__title").style = "background-color: rgba(0, 0, 0, 0.5);"
    }

    if(this.classList.contains("current")) {
      if(!this.querySelector('.state')) {
        let playIcon = new Icon("play");
        playIcon.setAttribute("icon-style", "width:100;height:100");
        let state = Object.assign(document.createElement('span'), {
          slot: 'state',
          className: 'state'
        });
        state.appendChild(playIcon);
        this.appendChild(state);
      }
    } else {
      let stateChild = this.querySelector(".state");
      if(stateChild && stateChild.firstChild) {
        this.removeChild(stateChild);
      }
    }
  }
}


class Playlist extends HTMLElement {
  get url() {return this.getAttribute('url')}
  set url(url) {this.setAttribute('url', url)}
  constructor() {
    super();
    imageCall(this.getAttribute("url"));
    this.filterOpened = false;
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
      this.current = data.name;
      this.updateCurrent();
    })
  }
  connectedCallback(){
    const url = this.getAttribute("url");
    const options = {
      port: 3000,
      host: this.getAttribute("url"),
      path: "/control/current",
    }
    if (! url){
      this.innerHTML = "<h1>Error : no playlist URL</h1>"
      return;
    }
    this.innerHTML = `<div style="margin-left: 50%;"><load-spinner id="playlist-spinner" active ></load-spinner></div>`
    fetch(options).then(e => {
      this.current = decodeURIComponent(escape(JSON.parse(e).name));
      this.update(url);
    });
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
    let r = "";
    if (!this.getAttribute("url")){
      console.warn("Can't update product's playlist : No valid URL", this);
    }
    //console.log("Fetching playlist on : ",target);
    try{
      let options = {
        port: 3000,
        host: this.getAttribute("url"),
        path: "/playlist",
      }
      r = await fetch(options);
      r = JSON.parse(r);
    }catch(e){
      if (e.type != 'invalid-json'){
        console.warn("Invalid response : ",e);
      }
      r = [];
    }
    this.render(r);
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
    elem.classList.add("is-selected");
    elem.render();
  }
  updateCurrent() {
    let currentMedia = document.querySelector(".current");
    if(currentMedia) {
      currentMedia.classList.remove("current");
      currentMedia.render();
    }

    let item = document.getElementById(this.current);
    if(item) {
      item.classList.add('current');
      item.render();
    }
  }
  updateToolbar(elem) {
    let toolbar = document.querySelector(".mdc-top-app-bar__section--align-end");
    while(toolbar.firstChild) {
      toolbar.removeChild(toolbar.firstChild);
    }
    if(document.querySelectorAll('.is-selected').length == 1) {
      let playButton = Object.assign(document.createElement("a"), {
          className: "play-menu material-icons mdc-top-app-bar__action-item",
          title: `lance directement le média sélectionné`,
          onclick: this.requestUpdate.bind(this, "put", `/control/current/${elem[0].name}`),
        }
      );
      let playIcon = new Icon("play");
      playButton.appendChild(playIcon);
      toolbar.appendChild(playButton);
    }
    if(document.querySelectorAll('.is-selected').length > 0) {
      let removeButton = Object.assign(document.createElement("a"), {
          className: "play-menu material-icons mdc-top-app-bar__action-item",
          title: `supprime définitivement tout les médias sélectionnés`
        }
      );
      removeButton.addEventListener("click", () => {
        elem.forEach((e) => {
          this.requestUpdate("delete", `/medias/${e.name}`, null)
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
      this.update();
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
  render(list){
    let url = this.getAttribute("url");
    //Reset self content.
    while(this.firstChild){
      this.removeChild(this.firstChild);
    }
    let d = document.createElement("div");
    Object.assign(d.style, {'display':"flex", 'flexWrap': 'wrap'});

    list.map((l)=>{delete l._id; return l;}).filter(info => this.filter(info)).map((info)=>{
      let elem = Object.assign(new PlaylistItem(),{
        title: decodeURIComponent(escape(info.name)),
        id: decodeURIComponent(escape(info.name)),
        url: this.getAttribute("url"),
        image: `/medias/${decodeURIComponent(escape(info.name))}`,
        name: decodeURIComponent(escape(info.name))
      })

      // Selection
      let selector = elem.shadowRoot.querySelector("#selector");
      elem.addEventListener("click", (event) => {
        let selected = document.querySelectorAll(".is-selected");
        if(selected && selected.length > 0) {
          for(let i = 0; i < selected.length; i++) {
            if(selected[i] != elem || selected.length > 1) {
              selected[i].classList.remove("is-selected");
              selected[i].shadowRoot.querySelector("#selector").checked = false;
              selected[i].render();
            }
          }
        }
        if(!elem.classList.contains("is-selected")) {
          this.select(elem);
          selector.checked = true;
        } else if(info.active) {
          // Play
          this.requestUpdate("put", `/control/current/${elem.name}`);
        }
        this.updateToolbar([info]);
      }, false);

      elem.appendChild(Object.assign(document.createElement("span"),{
        slot: "name",
        textContent: elem.name.split('.')[0]
      }));

      // Switch Actif / Inactif
      elem.shadowRoot.querySelector("#basic-switch").checked = info.active;
      elem.shadowRoot.querySelector("#basic-switch").addEventListener("click", (event) => {
        this.requestUpdate("put", "/playlist", Object.assign(info,{active:!info.active}));
        event.stopPropagation();
      }, {once: true});

      elem.shadowRoot.querySelector("#selector").addEventListener("click", (event) => {
        if(selector.checked) {
          this.select(elem);
        } else {
          elem.classList.remove('is-selected');
          elem.render();
        }
        this.updateToolbar(document.querySelectorAll(".is-selected"));
        event.stopPropagation();
      })

      // Delete button
      let rightAction = document.createElement("span");
      rightAction.slot = "right-action";
      let rightButton = Object.assign(document.createElement("button"), {
          className: "right-button",
          title: `supprimer définitivement ce média`,
          style: "background-color: darkred; color: white; border-color: darkred; width: 30px; height: 30px; border-radius: 2px;",
          onclick: this.requestUpdate.bind(this, "delete", `/medias/${elem.name}`, null)
        }
      );
      let icon = new Icon("delete");
      icon.setAttribute('icon-style', "width:16;height:16")
      rightButton.appendChild(icon);
      rightAction.appendChild(rightButton);
      elem.appendChild(rightAction);

      let mainAction = document.createElement("span");
      mainAction.slot = "main-action";
      let mainButton = Object.assign(document.createElement("button"), {
          className: "main-button mdc-button",
          style: "color: white; height: 26px; margin: 0px; min-width:26px; padding: 0px; padding-right: 8px;",
          title: `lance directement ce média`,
          onclick: this.requestUpdate.bind(this, "put", `/control/current/${elem.name}`)
        }
      );
      let playIcon = new Icon("play");
      icon.setAttribute("icon-style", "width:16;height:16");
      if(info.active) mainButton.appendChild(playIcon);
      mainAction.appendChild(mainButton);
      elem.appendChild(mainAction);

      let self = this;
      const menu = new Menu();
      menu.append(new MenuItem({label: "Jouer", click() {if(info.active) self.requestUpdate("put", `/control/current/${elem.name}`)}}));
      menu.append(new MenuItem({label: "Activer/Desactiver", click() {self.requestUpdate("put", "/playlist", Object.assign(info,{active:!info.active}))}}))
      menu.append(new MenuItem({label: "Supprimer", click() {self.requestUpdate("delete", `/medias/${elem.name}`, null)}}))

      elem.addEventListener("contextmenu", (e) => {
        menu.popup({window: remote.getCurrentWindow()})
      }, false);

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
      console.log("UPLOADER changed");
      this.update();
    }
    uploader.appendChild(button)
    d.appendChild(uploader);
    this.appendChild(d);
    uploader = new Upload(card(`
      .playlist-card{
        background:#888;
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
    uploader.classList.add("uploaderCard")
    let uploadIcon = new Icon("upload");
    uploadIcon.setAttribute('icon-style', "width:48;height:48");
    uploadIcon.setAttribute("slot","name");
    uploader.appendChild(uploadIcon);
    uploader.onchange = (evt)=>{
      console.log("UPLOADER changed");
      this.update();
    }
    d.insertBefore(uploader, d.firstChild);

    window.addEventListener("scroll", () => {
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
    }, false)
  }
}

window.customElements.define("h-playlist", Playlist);
window.customElements.define("h-product", Product);
window.customElements.define("h-item", PlaylistItem);
window.customElements.define("h-infos", ProductInfo);
module.exports = {Product};
