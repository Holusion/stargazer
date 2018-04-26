'use strict';
const p = require('./resolver');
const {Product} = require('./Product');
const {listenList, getList} = require("./store");

const {navigate, currentHash} = require("./router");


class Products extends HTMLElement {
  constructor(){
    super();
    listenList(this.onList.bind(this));
  }
  onList(evt){
    let l = evt.detail;
    while(this.ul.firstChild){
      this.ul.removeChild(this.ul.firstChild);
    }
    if (0 < l.length){
      l.forEach(this.push.bind(this));
    }else{
      this.ul.innerHTML =`Aucun produit trouvé<br>vérifiez la connexion<br>puis actualisez`;
    }

  }
  connectedCallback(){
    let i = p("static/img/1-1.jpg");
    Object.assign(this.style,{width:"1200px"})
    this.className = "mdc-grid-list";
    this.ul = document.createElement("div");
    this.ul.className = "mdc-list"
    this.ul.style.width = "1200px";
    this.appendChild(this.ul);
    this.onList({detail:getList()});
  }
  push(p){
    if (!p.name){
      console.error("Trying to create an invalid product : ",p);
      return
    }
    let current = currentHash();
    let id = encodeURIComponent(p.name);
    let accessible = p.addresses && p.addresses[0];
    let li = document.createElement("a");
    li.className = "mdc-list-item drawer-list-item"
    if (current == `products/${id}`){
      li.classList.add("mdc-list-item--selected");
    }
    li.id = id;
    li.href = id;
    li.onclick = function(e){
      e.preventDefault();
      let selection = document.querySelector(".mdc-list-item.drawer-list-item.mdc-list-item--selected")
      if (selection){
        selection.classList.remove("mdc-list-item--selected");
      }
      li.classList.add("mdc-list-item--selected");
      navigate(`products/${li.id}`);
    }
    li.innerHTML =   `<h-icon name="library" icon-style="fill:currentColor" class="mdc-list-item__graphic"></h-icon>${p.name.split(" ")[0]}`;
    this.ul.appendChild(li);
  }
}

if (typeof window == "object" && window.customElements){
  window.customElements.define("h-products",Products);
}
if (typeof module == "object"){
  module.exports = {Products};
}
