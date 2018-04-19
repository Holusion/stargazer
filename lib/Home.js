'use strict';
const main = require("./templates/main");
const p = require("./resolver");

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
  <div slot="content">
      <div id="welcome-screen" style="
        max-width:1200px;
        margin: auto;
        padding:10px;
        color: #103040;
      ">
        <h1 style="text-align:center; color:var(--mdc-theme-secondary)">Bienvenue</h1>

        <p> Utilisez la liste dans la colonne de gauche pour sélectionner le produit à utiliser</p>
        <p> Si la liste est vide, vérifiez que votre produit est correctement connecté au réseau et actualisez <h-icon name="refresh" icon-style="width:16px;height:16px"></h-icon></p>
        <div class="mdc-elevation--z6" style="
          padding: 8px;
          margin: auto;
          align: center;
          display: block;
          width: 70%;">
          <img style="display: block;max-width: 100%;height: auto;" src="${p("static/img/connect.svg#connect")}">
        </div>
      </div>
    </div>
    `
  }
}

window.customElements.define("h-home",Home);
module.exports = Home;
