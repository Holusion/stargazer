'use strict';

module.exports = function createInfos(style){
  const tmpl = document.createElement("template");
  tmpl.innerHTML = `
  <link rel="stylesheet" href="../node_modules/material-components-web/dist/material-components-web.css">
  <ul class="mdc-list mdc-list--two-line product-info">
    <li class="mdc-list-item">
      <span class="mdc-list-item-item__text">
        Version du controller :
        <span class="mdc-list-item__secondary-text">
          <slot name="version">Impossible d'obtenir la version du produit</slot>
        </span>
      </span>
    </li>
    <li class="mdc-list-item">
      <span class="mdc-list-item-item__text">
        IP du produit :
        <span class="mdc-list-item__secondary-text">
          <slot name="url">Url non trouvée</slot>
        </span>
      </span>
    </li>
  </ul>
  `;
  return tmpl.content;
}
