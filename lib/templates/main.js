'use strict';


module.exports = function createCard(style){
  const tmpl = document.createElement("template");
  tmpl.innerHTML = `
    <link rel="stylesheet" href="../node_modules/material-components-web/dist/material-components-web.css">
    <header class="mdc-toolbar mdc-elevation--z4">
      <div class="mdc-toolbar__row">
        <section class="mdc-toolbar__section mdc-toolbar__section--align-start">
          <span>
            <a onclick="goBack()" class="mdc-toolbar__menu-icon">
              <h-icon name="back"/>
            </a>
          </span>
          <button class="demo-menu material-icons mdc-toolbar__menu-icon" onclick='document.querySelector("aside").classList.toggle("mdc-drawer--open")'>
            <h-icon name="menu"/>
          </button>
          <span class="mdc-toolbar__title catalog-title"><slot name="title">Holusion</slot></span>
        </section>
        <section class="mdc-toolbar__section mdc-toolbar__section--align-end">
          <span><slot name="log"></slot></span>
          <span class="mdc-toolbar__title catalog-title"><slot name="version"></slot></span>
        </section>
      </div>
    </header>
    <main class="main-content"><slot name="content">
      <h1 class="mdc-typography--display1">Connect a product to begin</h1>
    </slot></main>
  `;
  return tmpl.content;
}
