'use strict';

module.exports = function createMain(style){
  const tmpl = document.createElement("template");
  tmpl.innerHTML = `
    <style>${style}</style>
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
        </section>
      </div>
    </header>
    <section>
      <slot name="tabs"></slot>
    </section>
    <main class="main-content">
      <slot name="content"></slot>
    </main>
  `;
  return tmpl.content;
}
