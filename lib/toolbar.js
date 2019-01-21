'use strict';
const Icon = require('./Icon.js')

let toolbar = document.querySelector(".mdc-top-app-bar__section--align-end");

const render = function(tools) {
  while(toolbar.firstChild) {
    toolbar.removeChild(toolbar.firstChild);
  }
  for(let t of tools) {
    if(typeof(t) == "string") {
      if(t == "separator" && toolbar.firstChild) {
        let separator = Object.assign(document.createElement("div"), {
          style: "width: 8px; height: 80%; border-left: 1px solid lightgrey; margin-left: 8px;"
        });
        toolbar.appendChild(separator);
      }
    } else {
      let button = Object.assign(document.createElement("a"), {
        className: "play-menu material-icons mdc-top-app-bar__action-item",
        id: t.id,
        title: t.title,
        onclick: () => {t.func();},
      });
      let icon = new Icon(t.id);
      button.appendChild(icon);
      toolbar.appendChild(button);
    }
  }
}

module.exports = {render}
