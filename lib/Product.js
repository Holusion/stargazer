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
      if(index == 1) {
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
  }
}


class Playlist extends HTMLElement {
  get url() {return this.getAttribute('url')}
  set url(url) {this.setAttribute('url', url)}
  constructor() {
    super();
    imageCall(this.getAttribute("url"));
  }
  connectedCallback(){
    const url = this.getAttribute("url");
    if (! url){
      this.innerHTML = "<h1>Error : no playlist URL</h1>"
      return;
    }
    this.innerHTML = `<div style="margin-left: 50%;"><load-spinner id="playlist-spinner" active ></load-spinner></div>`
    this.update(url);
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
        endTask(targetPath, new InternalError(`${options.method}: ${options.host}:${options.port}/${options.path} - (${res.statusCode}) ${res.statusMessage}`));
      }
    } catch(err) {
      endTask(targetPath, err);
    }
  }
  render(list){
    let url = this.getAttribute("url");
    //Reset self content.
    while(this.firstChild){
      this.removeChild(this.firstChild);
    }
    let d = document.createElement("div");
    Object.assign(d.style, {'display':"flex", 'flexWrap': 'wrap'});

    list.map((l)=>{delete l._id; return l;}).map((info)=>{
      let elem = Object.assign(new PlaylistItem(),{
        title: info.name,
        id: encodeURIComponent(info.name),
        url: this.getAttribute("url"),
        image: `/medias/${info.name}`
      })

      // Selection
      elem.addEventListener("click", () => {
        let selected = document.querySelectorAll(".is-selected");
        if(selected && selected.length > 0) {
          for(let i = 0; i < selected.length; i++) {
            if(selected[i] != elem) {
              selected[i].classList.remove("is-selected")
              selected[i].render();
            }
          }
        }
        if(!elem.classList.contains("is-selected")) {
          elem.classList.add("is-selected");
          elem.render();
        } else if(info.active) {
          // Play
          this.requestUpdate("put", `/control/current/${info.name}`);
        }
      }, false);

      elem.appendChild(Object.assign(document.createElement("span"),{
        slot: "name",
        textContent: info.name.split('.')[0]
      }));

      // Switch Actif / Inactif
      elem.shadowRoot.querySelector("#basic-switch").checked = info.active;
      elem.shadowRoot.querySelector("#basic-switch").addEventListener("click", () => {
        this.requestUpdate("put", "/playlist", Object.assign(info,{active:!info.active}))
      }, {once: true});

      // Delete button
      let rightAction = document.createElement("span");
      rightAction.slot = "right-action";
      let rightButton = Object.assign(document.createElement("button"), {
          className: "right-button",
          title: `supprimer définitivement ce média`,
          style: "background-color: darkred; color: white; border-color: darkred; width: 30px; height: 30px; border-radius: 2px;",
          onclick: this.requestUpdate.bind(this, "delete", `/medias/${info.name}`, null)
        }
      );
      let icon = new Icon("delete");
      icon.setAttribute('icon-style', "width:16;height:16")
      rightButton.appendChild(icon);
      rightAction.appendChild(rightButton);

      // elem.appendChild(actions);
      elem.appendChild(rightAction);

      return elem;
    }).forEach((elem)=>{
      d.appendChild(elem);
    });
    //Upload is a neutral web component that just react to clicks. We need to style it a bit
    let button = Object.assign(document.createElement("button"), {
      className: "mdc-fab material-icons",
      title: "Uploader une vidéo",
      style: "position: fixed; bottom: 1rem; right: 1rem;"
    });
    let ic = new Icon("library");
    button.appendChild(ic);
    let uploader = new Upload();
    uploader.setAttribute("url", this.getAttribute("url"));
    uploader.onchange = (evt)=>{
      console.log("UPLOADER changed");
      this.update();
    }
    uploader.appendChild(button)
    d.appendChild(uploader);
    this.appendChild(d);
  }
}

window.customElements.define("h-playlist", Playlist);
window.customElements.define("h-product", Product);
window.customElements.define("h-item", PlaylistItem);
window.customElements.define("h-infos", ProductInfo);
module.exports = {Product};
