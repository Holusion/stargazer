const Icon = require('./Icon.js')

let tools = [];
let toolbar = document.querySelector(".mdc-top-app-bar__section--align-end");

const clean = function() {
  tools = [];
}

const addTool = function(id, title, func) {
  tools.push({
    id: id,
    title: title,
    func: func,
    icon: id
  })
}

const removeTool = function(id) {
  let elem = tools.filter(e => e.id == id);
  let index = tools.indexOf(elem[0]);
  tools.splice(index, 1);
}

const addSeparator = function() {
  tools.push('separator');
}

const render = function() {
  while(toolbar.firstChild) {
    toolbar.removeChild(toolbar.firstChild);
  }
  for(t of tools) {
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
        onclick: () => {t.func(); this.render()},
      });
      let icon = new Icon(t.icon);
      button.appendChild(icon);
      toolbar.appendChild(button);
    }
  }
}

module.exports = {
  clean,
  addTool,
  addSeparator,
  removeTool,
  render,
}
