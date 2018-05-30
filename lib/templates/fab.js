'use strict'

module.exports = function createFab(style) {
  const fab_template = document.createElement("template");
  fab_template.innerHTML = `
  <style>
  :host([visible='false']) {
    opacity: 0;
  }

  :host([visible='true']) {
    visibility: visible;
    opacity: 1;
    transition-delay: 0s;
  }
  :host {
    display: block;
    position: fixed;
    min-width: 56px;
    min-height: 56px;
    margin-right: 12px;
    bottom: 24px;
    right: 24px;
    visibility: hidden;
    opacity: 0;
    transition: visibility 0s linear 0.5s, opacity 0.5s linear;
  }
  ${style}
  </style>
  <link rel="stylesheet" href="../node_modules/material-components-web/dist/material-components-web.css">
  <button class="mdc-fab material-icons" title="Uploader une vidéo">
    <slot name="content"></slot>
  </button>
  `
  return fab_template.content;
}
