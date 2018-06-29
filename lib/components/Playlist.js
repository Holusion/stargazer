'use strict';

const {ipcRenderer, remote} = require('electron');
const io = require('socket.io-client');

const {getList, listenList, dispatchTask, endTask} = require("../store");
const {imageCall, fetch, request, makeIcon} = require("../utils");
const toolbar = require("../toolbar.js");
const Upload = require("../Upload");
const Icon = require("../Icon");

const card = require("../templates/card");

const {PlaylistItem} = require('./PlaylistItem');
const {UploadCard} = require('./UploadCard');
const {UploadButton} = require('./UploadButton');
const {FilterPanel} = require('./FilterPanel');

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
        document.getElementById(this.current).current = true;
        this.updateCurrent();
      }
    });
    this.socket.on('update', (doc) => {
      this.updatePlaylist();
    });
    this.socket.on('remove', (doc) => {
      this.updatePlaylist();
    });
    this.socket.on('insert', (doc) => {
      this.updatePlaylist();
    })
    this.listenChange();
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
    this.update();
    this.removeChild(this.firstChild);
  }
  listenChange() {
    document.addEventListener('cardchange', (evt) => {
      const elem = evt.detail.elem;
      switch(evt.detail.action) {
          case 'start':
            if(elem.start) {
              this.current = elem.name;
              elem.current = true;
              this.playItem(elem);
              elem.start = 'false';
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
        endTask('no_response', e);
      }
      r = [];
    }
    this.render(r);
    let e = await fetch(options)
    let elem = document.getElementById(decodeURIComponent(escape(JSON.parse(e).name)));
    if(elem) {
      elem.current = 'true';
      this.updateCurrent();
      this.current = decodeURIComponent(escape(JSON.parse(e).name));
    }
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
      if(document.querySelector("h-item[current=true]")) {
        document.querySelector("h-item[current=true]").render()
      }
    }
  }
  updateToolbar(elem) {
    toolbar.clean();

    if(this.selectedCards.length == 1) {
      toolbar.addTool('play', `lance directement le média sélectionné`, this.selectedCards[0].play.bind(this.selectedCards[0]));
    }
    if(this.selectedCards.length > 0) {
      toolbar.addTool('delete', `supprime définitivement tout les médias sélectionnés`, () => elem.forEach(e => e.remove()));
    }
    let tmpFilterOption = {};
    toolbar.addSeparator();
    let filterpanel = this.querySelector('h-filter');
    const openFilterPanel = () => {
      this.insertBefore(new FilterPanel(this.filterOption), this.firstChild);
      toolbar.removeTool('filter');
      this.updateToolbar(elem);
    }
    if(filterpanel) {
      const removeFilterPanel = () => {
        toolbar.removeTool('close');
        toolbar.removeTool('check');
        toolbar.addTool('filter', `ouvre le le menu de filtre`, openFilterPanel);
        this.removeChild(filterpanel);
      }
      toolbar.addTool('close', `annule les modifications sur le filtre`, removeFilterPanel);
      toolbar.addTool('check', `valide les filtres sélectionnés`, () => {
        removeFilterPanel();
        this.filterOption = filterpanel.filterOption;
        this.updatePlaylist();
      });
    } else {
      toolbar.addTool('filter', `ouvre le le menu de filtre`, openFilterPanel)
    }
    toolbar.render();
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
    if(this.querySelector('#playlist-content')) {
      this.removeChild(this.querySelector('#playlist-content'))
    }
    let surroundD = document.createElement('div');
    surroundD.id = 'playlist-content';
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
    let uploadButton = new UploadButton();
    uploadButton.url = this.getAttribute('url');
    uploadButton.onchange = (evt)=>{
      this.upload();
    }
    d.appendChild(uploadButton);
    this.appendChild(surroundD);

    let uploadCard = new UploadCard();
    uploadCard.url = this.getAttribute('url');
    uploadCard.onchange = (evt)=>{
      this.upload();
    }
    d.insertBefore(uploadCard, d.firstChild);
    surroundD.addEventListener("scroll", () => {
      if(!document.querySelector(".uploaderCard") || !document.querySelector(".uploaderButton")) return;
      let box = document.querySelector(".uploaderCard").getBoundingClientRect();
      if(box.bottom <= 160) {
        uploadButton.visible = true;
      } else {
        uploadButton.visible = false;
      }
    }, false);
  }
}

module.exports = {Playlist};
