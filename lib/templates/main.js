'use strict';

module.exports = function createMain(style){
  const tmpl = document.createElement("template");
  tmpl.innerHTML = `
    <style>${style}</style>
    <link rel="stylesheet" href="../node_modules/material-components-web/dist/material-components-web.css">
    <main class="main-content mdc-toolbar-fixed-adjust">
      <section>
      <slot name="tabs"></slot>
      </section>
      <slot name="content"></slot>
    </main>
  `;

  return tmpl.content;
}
