'use strict';
const p = require("./resolver");

class Icon extends HTMLElement{
  static get observedAttributes() {return ['icon-style', "name"]; }
  constructor(name){
    super();
    if(name){
      this.setAttribute("name", name);
    }
  }
  connectedCallback(){
    this.setStyle();
  }
  attributeChangedCallback(){
    this.setStyle();
  }
  splitStyle(style){
    return style.replace(/[\s\n]/,"").split(";").map((o)=>o.split(":"))
  }

  setStyle(){
    while(this.firstChild){
      this.removeChild(this.firstChild);
    }
    this.appendChild(Icon.makeIcon(this.getAttribute("name")));
    let style = this.getAttribute("icon-style");
    let ic = this.firstChild;
    if (!style || ! ic){
      return;
    }
    this.splitStyle(style).forEach((k)=>{
      ic.setAttributeNS(null, k[0], k[1]);
    });
  }
  static makeIcon(name){
    if (!name){
      name = "default";
    }
    let n = Icon.getNode("svg", {fill:"currentColor", width: 24, height: 24, viewBox:"0 0 24 24"});
    let u = Icon.getNode('use',{})
    u.setAttributeNS('http://www.w3.org/1999/xlink', 'href', `${p("static/icons/combined.svg#icon-"+name
  )}`);
    n.appendChild(u);
    return n;
  }
  static getNode(n, v) {
    n = document.createElementNS("http://www.w3.org/2000/svg", n);
    for (var p in v){
      n.setAttributeNS(null, p, v[p]);
    }
    return n;
  }
}
window.customElements.define("h-icon", Icon);
module.exports = Icon;
