'use strict';

const filterpanel = require('../templates/filterpanel');

class FilterPanel extends HTMLElement {
  constructor(filterOption) {
    super();
    let dom = this.attachShadow({mode: 'open'});
    dom.appendChild(filterpanel());
    this.filterOption = filterOption;
  }

  connectedCallback() {
    this.render();
  }

  addOption(name, slot, proposition) {
    let div = Object.assign(document.createElement("div"), {
      style: "padding: 16px; width: 50px;",
      slot: slot
    });
    div.innerHTML = `
    <div class="mdc-checkbox" style="padding: 0; display: flex; flex-direction: row; align-items: center;">
      <input type="checkbox" class="mdc-checkbox__native-control" id="selector_${slot}"/>
      <div class="mdc-checkbox__background" style="left: 0; top: 0; width:100%; height: 100%;">
        <svg class="mdc-checkbox__checkmark" viewBox="0 0 24 24">
          <path class="mdc-checkbox__checkmark-path"
          fill="none"
          stroke="white"
          d="M1.73,12.91 8.1,19.28 22.79,4.59"/>
        </svg>
      <div class="mdc-checkbox__mixedmark"></div>
    </div>
    <label for="selector_${slot}" style="margin-left: 24px;">${name}</label>`;

    let checkbox = div.querySelector(`#selector_${slot}`);
    if(this.filterOption[name]) {
      checkbox.checked = true;
    }
    checkbox.addEventListener("change", () => {
      checkbox.checked ? this.filterOption[name] = proposition : delete this.filterOption[name]
    })

    return div;
  }

  render() {
    this.appendChild(this.addOption("Actif", "enable", info => info.active));
    this.appendChild(this.addOption("Inactif", "disable", info => !info.active));
  }
}

window.customElements.define("h-filter", FilterPanel);
module.exports = {FilterPanel}
