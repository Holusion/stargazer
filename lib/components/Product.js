const {ipcRenderer, remote} = require('electron');
const net = require("net");

const {getList, listenList, dispatchTask, endTask} = require("../store");
const {imageCall, fetch, request, makeIcon} = require("../utils");

const {Playlist} = require('./Playlist');
const {PlaylistItem} = require('./PlaylistItem');
const {ProductInfo} = require('./ProductInfo');

const main = require("../templates/main");

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

window.addEventListener("scroll", () => {
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

window.customElements.define("h-playlist", Playlist);
window.customElements.define("h-product", Product);
window.customElements.define("h-item", PlaylistItem);
window.customElements.define("h-infos", ProductInfo);
module.exports = {Product};
