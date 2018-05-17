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
    let shell = require('electron').shell
    document.addEventListener('click', function (event) {
      if (event.target.tagName === 'A' && event.target.href.startsWith('http')) {
        event.preventDefault()
        shell.openExternal(event.target.href)
      }
    })

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

        <div class="mdc-elevation--z6" style="
          padding: 8px;
          margin: auto;
          align: center;
          display: block;
          width: 70%;">
          <img style="display: block;max-width: 100%;height: auto;" src="${p("static/img/connect.svg#connect")}">
        </div>
        <p> Utilisez la liste dans la colonne de gauche pour sélectionner le produit à utiliser</p>
        <p> Si la liste est vide, vérifiez que votre produit est correctement connecté au réseau et actualisez</p>
        <p> Le produit est détecté lorsqu'il apparaît dans le menu à gauche de cette fenêtre. Sélectionnez le produit pour l'utiliser</p>
        <p> Pour toute aide, visitez</p>
        <ul>
          <li>La <a style="color:var(--mdc-theme-secondary); font-weight: bold" href="https://github.com/Holusion/stargazer" onclick="externalLink()">documentation de Stargazer</a> pour le guide d'utilisation</li>
          <li>Le site <a style="color:var(--mdc-theme-secondary); font-weight: bold" href="http://holusion.com" onclick="externalLink()">Holusion.com</a> pour le nous contacter</li>
          <li>Le <a style="color:var(--mdc-theme-secondary); font-weight: bold" href="https://github.com/Holusion/stargazer/issues" onclick="externalLink()">bugtracker</a> pour nous remonter un bug</li>
        </ul>
      </div>
    </div>
    `
  }
}

window.customElements.define("h-home",Home);
module.exports = Home;
