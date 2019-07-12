'use strict';

module.exports = function createPanel(style){
  const panel_template = document.createElement("template");
  panel_template.innerHTML = `
    <style>
    @keyframes add {
      0% {
        height: 0px;
        transform: scaleY(0);
      }
      100% {
        height: 64px;
        transform: scaleY(1);
      }
    }

    @keyframes remove {
      0% {
        height: 64px;
        transform: scaleY(1);
      }
      100% {
        height: 0px;
        transform: scaleY(0);
      }
    }

    :host([visible="true"]) .filterPanel{
      animation: add 0.5s ease-in-out;
      height: 64px;
      transform: scaleY(1);
    }
    :host([visible="false"]) .filterPanel{
      animation: remove 0.5s ease-in-out;
      height: 0px;
      transform: scaleY(0);
    }
    :host(label){
      margin-left: 24px;
    }
    .filterPanel {
      width: 100%;
      height: 0px;
      transform: scaleY(0);
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      border-bottom: 1px solid black;
      margin-bottom: 16px;
    }
    ${style}
    </style>
    <link rel="stylesheet" href="../node_modules/material-components-web/dist/material-components-web.css">
    <div class="filterPanel">
      <h3>Filtre : </h3>
      <slot name="enable">Not work</slot>
      <slot name="disable">Not work</slot>
    </div>
  `
  //Add slot to add more filter
  return panel_template.content;
}
