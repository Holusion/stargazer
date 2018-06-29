'use strict';

module.exports = function createPanel(style){
  const panel_template = document.createElement("template");
  panel_template.innerHTML = `
    <style>
    :host{
      width: 100%;
      display: flex;
      flex-flow: nowrap;
      align-items: center;
      justify-content: center;
      min-height: 64px;
      padding: 24px;
      border-bottom: 1px solid black;
    }
    :host(label){
      margin-left: 24px;
    }
    ${style}
    </style>
    <link rel="stylesheet" href="../node_modules/material-components-web/dist/material-components-web.css">
    <h3>Filtre : </h3>
    <slot name="enable">Not work</slot>
    <slot name="disable">Not work</slot>
  `
  //Add slot to add more filter
  return panel_template.content;
}
