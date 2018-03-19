'use strict';
const r2 = require("r2");
const url = require("url");
const http = require("http");
const p = require('./resolver');
const Upload = require("./Upload");
const Icon = require("./Icon");
const {getList, listenList, dispatchTask, endTask} = require("./store");

const card = require("./templates/card");
const main = require("./templates/main");

function fetch(options) {
  let obj = "";
  return new Promise((resolve, reject) => {
    let req = http.get(options)
    req.on('response', (res) => {
      res.on('data', (chunk) => {
        obj += chunk;
      })
    })
    req.on('error', (error) => {
      if(options.host.includes("%")) {
        options.host = options.host.split("%")[0];
        obj = fetch(options);
      } else {
        console.log(error);
        reject(error);
      }
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
      if(options.host.includes("%")) {
        options.host = options.host.split("%")[0];
        obj = request(options, data);
      } else {
        console.log(error);
        reject(error);
      }
    })
    req.on('close', () => {
      resolve(obj);
    });
    if(data) {
      req.setHeader('Content-Type', 'application/json')
    }
    req.write(data);
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
  static render(elem, list){
    let infos = list.find((p)=>{
      return p.name == elem.id;
    });

    console.log("name : ",elem.id)
    if (! infos){
      elem.innerHTML = `<h1>Product not found</h1>`;
      return;
    }
    //Use the template's slot properties
    elem.innerHTML = `
    <span slot="title" title="${infos.addresses.join(", ")}">
      ${infos.name}
    </span>
    <span slot="version">Not available</span>
    <div slot="image">
        <img class="mdc-card__media-item" src="../static/img/1-1.jpg">
    </div>

    <h-playlist url="${infos.addresses[0]}%${infos.networkInterface}" slot="content"/>
    `;
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
    let img = this.getAttribute("image");
    let dom = this.shadowRoot;
    console.log("image url : ",(img)?img:p("public","img","1-1.jpg"));
    dom.querySelector(".card").style.backgroundImage = (img)? `url(${img})`: `url(../static/img/1-1.jpg)`;

  }
}


class Playlist extends HTMLElement {
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
    if (typeof body === "object"){
      opts.json = body;
    }
    let options = {
      port: 3000,
      host: this.getAttribute("url"),
      path: encodeURI(targetPath),
      method: method.toUpperCase()
    }
    let res = await request(options, JSON.stringify(opts.json));
    if(res.statusCode === 200) {
      await this.update();
    } else {
      console.warn(res);
      alert(res.statusMessage); //FIXME use InternalError
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
        image: this.absoluteUrl(`/medias/${info.name}?thumb=true`)
      })

      elem.appendChild(Object.assign(document.createElement("span"),{
        slot: "name",
        textContent: info.name
      }))

      let actions = document.createElement("span");
      actions.slot = "actions";
      if(info.active){
        actions.appendChild(Object.assign(
          document.createElement("button"), {
            className: "mdc-button mdc-button--compact mdc-card__action",
            textContent: "Lire",
            title: `Afficher immédiatement cet élément`,
            onclick: this.requestUpdate.bind(this, "put", `/control/current/${info.name}`)
          }
        ));
      }

      actions.appendChild(Object.assign(
        document.createElement("button"), {
          className: "mdc-button mdc-button--compact mdc-card__action",
          textContent: (info.active)?"Actif":"Inactif",
          title: `${(info.active)?"désactiver":"activer"} ce média`,
          onclick: this.requestUpdate.bind(this, "put", "/playlist", Object.assign(info,{active:!info.active}))
        }
      ));
      actions.appendChild(Object.assign(
        document.createElement("button"), {
          className: "mdc-button mdc-button--compact mdc-card__action",
          textContent: "Supprimer",
          title: `supprimer définitivement ce média`,
          onclick: this.requestUpdate.bind(this, "put", `/medias/${info.name}`)
        }
      ));

      elem.appendChild(actions);

      return elem;
    }).forEach((elem)=>{
      d.appendChild(elem);
    });
    //Upload is a neutral web component that just react to clicks. We need to style it a bit
    let uploader = new Upload(card(`
      .playlist-card{
        background:#888;
        display:flex;
        alignItems:center;
        justifyContent:center;
      }
    `));
    uploader.setAttribute("url", this.getAttribute("url"));
    let ic = new Icon("library");
    ic.setAttribute('icon-style', "width:48;height:48");
    ic.setAttribute("slot","name");
    uploader.appendChild(ic);
    uploader.onchange = (evt)=>{
      console.log("UPLOADER changed");
      this.update();
    }
    d.appendChild(uploader);
    this.appendChild(d);
  }
}

window.customElements.define("h-playlist", Playlist);
window.customElements.define("h-product", Product);
window.customElements.define("h-item", PlaylistItem);
module.exports = {Product};
