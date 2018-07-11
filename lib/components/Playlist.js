'use strict';

const {dispatchTask, endTask, listenPlaylist} = require("../store");
const {imageCall, fetch, request} = require("../utils");

class Playlist {
  constructor(url) {
    this.url = url;
    imageCall(this.url);
    
    this.filterOption = {};

    listenPlaylist('current-playlist', e => {
      if(this.current && this.current != e.detail.name) {
        this.current = e.detail.name;
        document.getElementById(this.current).current = true;
        this.updateCurrent();
      }
    });
    listenPlaylist('update-playlist', e => this.updatePlaylist());
    listenPlaylist('remove-playlist', e => this.updatePlaylist());
    listenPlaylist('insert-playlist', e => this.updatePlaylist());
    
    this.listenChange();
  }
  attachPlaylistView(view) {
    this.view = view;
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
      hostname: this.url,
      pathname: path,
      port: 3000,
      query: attributes
    })
  }
  async update(){
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
      host: this.url,
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
    elem.selected = true;
  }
  unselect(elem) {
    elem.removeAttribute('selected');
  }
  upload() {
    console.log("UPLOADER changed");
    this.updatePlaylist();
  }
  async updatePlaylist() {
    const opt = {
      port: 3000,
      host: this.url,
      path: "/playlist",
    }
    const options = {
      port: 3000,
      host: this.url,
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
    this.view.render(r);
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
}

module.exports = {Playlist};
