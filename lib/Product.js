'use strict';
const r2 = require("r2");
const url = require("url");
const p = require('./resolver');
const Upload = require("./Upload");
const Icon = require("./Icon");
const {getList, listenList, dispatchTask, endTask} = require("./store");

const card = require("./templates/card");
const main = require("./templates/main");

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
      return encodeURIComponent(p.name) == elem.id;
    });
    if (! infos){
      elem.innerHTML = `<h1>Product not found</h1>`;
      return;
    }
    //Use the template's slot properties
    elem.innerHTML = `
    <span slot="title" title="${infos.access.join(", ")}">
      ${infos.name}
    </span>
    <span slot="version">${infos.version}</span>
    <div slot="image">
        <img class="mdc-card__media-item" src="../static/img/1-1.jpg">
    </div>

    <h-playlist url="${infos.access[0]}" slot="content"/>
    `;
  }
}



class PlaylistItem extends HTMLElement {
  get observedAttributes(){return ["name","image","active","rank", "url"]}
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
  async update(baseUrl){
    baseUrl = baseUrl || this.getAttribute("url");
    let r;
    if (!baseUrl){
      console.warn("Can't update product's playlist : No valid URL", this);
    }
    let target = url.resolve(baseUrl,"/playlist");
    //console.log("Fetching playlist on : ",target);
    try{
      r = await r2(target).json;
    }catch(e){
      if (e.type != 'invalid-json'){
        console.warn("Invalid response : ",e);
      }
      r = [];
    }
    this.render(r);
  }
  async requestUpdate(method, targetPath, body){
    let target = url.resolve(this.getAttribute("url"), targetPath);
    let opts = {};
    if (typeof body === "object"){
      opts.json = body;
    }
    let res = await r2[method](target, opts).response;
    if (res.ok){
      await this.update();
    }else{
      console.warn(res);
      alert(res.statusText); //FIXME use InternalError
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
        url: this.getAttribute("url")
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
            onclick: this.requestUpdate.bind(this, "put", `control/current/${info.name}`)
          }
        ));
      }

      actions.appendChild(Object.assign(
        document.createElement("button"), {
          className: "mdc-button mdc-button--compact mdc-card__action",
          textContent: (info.active)?"Actif":"Inactif",
          title: `${(info.active)?"désactiver":"activer"} ce média`,
          onclick: this.requestUpdate.bind(this, "put", "playlist", Object.assign(info,{active:!info.active}))
        }
      ));
      actions.appendChild(Object.assign(
        document.createElement("button"), {
          className: "mdc-button mdc-button--compact mdc-card__action",
          textContent: "Supprimer",
          title: `supprimer définitivement ce média`,
          onclick: this.requestUpdate.bind(this, "put", `medias/${info.name}`)
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
