'use strict';
const main = require("./templates/main");

class Home extends HTMLElement{
  constructor(){
    super();
    const shadowRoot = this.attachShadow({mode: 'open'})
        .appendChild(main());
  }
  connectedCallback(){
    this.innerHTML=`
    <span slot="title">
      Holusion
    </span>
    <div slot="content"> Selectionner un produit</div>
    `
  }
}

window.customElements.define("h-home",Home);
module.exports = Home;
