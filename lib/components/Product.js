'use strict';

const net = require("net");

const {getList, listenList, dispatchError, dispatchInfo} = require("../store");

const {ProductPanel} = require('./ProductPanel');
const {PlaylistItem} = require('./PlaylistItem');
const {ProductInfo} = require('./ProductInfo');
const {PlaylistItems} = require('./PlaylistItems');
const {BadProductIPFound} = require('../errors/BadProductIPFound');

const toolbar = require('../toolbar');

const main = require("../templates/main");

class Product extends HTMLElement{
  static get observedAttributes() {return ['id']; }
  constructor(){
    super();
    this.attachShadow({mode: 'open'}).appendChild(main());
  }

  connectedCallback(){
    if (!this.listener){
      this.listener = listenList((evt)=>{
        Product.render(this,evt.detail);
      });
    }
    if(getList().length > 0) {
      Product.render(this, getList());
    }
  }
  attributeChangedCallback(name, oldValue, nextValue){
    if(oldValue && oldValue != nextValue) {
      Product.render(this, getList());
    }
  }
  static async render(elem, list){
    let infos = list.find((p)=>{
      return p.name == elem.id;
    });
    let addr;

    if(infos) {
      addr = infos.addresses[0];

      // Fetch can't parse ipv6 addresses
      for(let a of infos.addresses) {
        if(net.isIP(a) == 4) {
          addr = a;
        }
      }
      switch (net.isIP(addr)) {
        case 6:
          addr = `[${addr}]:3000`;
          break;
        case 0:
          dispatchError(new BadProductIPFound(elem.id, addr));
          break;
        default:
      }
    } else {
      dispatchInfo("Produit déconnecté", `Le produit "${elem.id}" a été débranché ou a été arrêté. Vérifiez le câblage et assurez vous que le produit soit bien alimenté`);
      return;
    }

    // console.log("name : ",elem.id)
    if (! infos){
      elem.innerHTML = `<h1>Product not found</h1>`;
      return;
    }
    //Use the template's slot properties
    elem.innerHTML = `
    <span slot="title" title="${infos.addresses.join(", ")}">
      ${infos.name}
    </span>
    <div slot="image">
        <img class="mdc-card__media-item" src="../static/img/1-1.jpg">
    </div>
    <nav slot="tabs" id="basic-tab-bar" class="mdc-tab-bar">
      <a id="content" class="mdc-tab mdc-tab--active">Contenus
      <a id="infos" class="mdc-tab">Infos</a>
      <span class="mdc-tab-bar__indicator"></span></a>
    </nav>
    <h-playlist class="js-panel" url="${addr}" slot="content"/>
    `;
    document.querySelector("#title").innerHTML = `
      <span title="${infos.addresses.join(", ")}">
        ${infos.name}
      </span>
    `
    let tabs = new mdc.tabs.MDCTabBar(document.querySelector(".mdc-tab-bar"));


    tabs.preventDefaultOnClick = true;
    tabs.listen("MDCTabBar:change", async () => {
      let index = tabs.activeTabIndex;
      let response = await fetch(`http://${addr}/system/version`);
      let version = await response.text();
      let panel = document.querySelector(".js-panel");
      elem.removeChild(panel);
      if(document.getElementById("filter-panel")) {
        document.querySelector('#main-content').removeChild(document.getElementById('filter-panel'));
      }

      toolbar.render([]);

      if(index == 2) {
        // elem.appendChild(Object.assign(new PluginList(), {
        //   slot: "content",
        //   classList: ["js-panel"],
        // }));
      } else if(index == 1) {
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

window.customElements.define("h-playlist", ProductPanel);
window.customElements.define("h-product", Product);
window.customElements.define("h-item", PlaylistItem);
window.customElements.define("h-infos", ProductInfo);
window.customElements.define("h-playlist_items", PlaylistItems);
module.exports = {Product};
