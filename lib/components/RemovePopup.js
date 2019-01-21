'use strict'

const popup = require('../templates/popup')

class RemovePopup extends HTMLElement {
  static get observedAttributes(){return ["visible"]}
  set visible(val) {this.setAttribute('visible', val)}
  get visible() {this.getAttribute('visible')}

  constructor() {
    super();
    let dom = this.attachShadow({mode: 'open'});
    dom.appendChild(popup());
  }

  connectedCallback() {
    this.render();
  }

  close() {
    console.log("test")
    this.visible = false;
    this.addEventListener('transitionend', () => {
      document.body.removeChild(this);
    })
  }

  render() {
    this.innerHTML = `<span slot='content'>Voulez vous vraiments supprimer ces fichiers ?</span>`
    let div = Object.assign(document.createElement('div'), {
      slot:"content"
    })
    let buttonYes = Object.assign(document.createElement('button'), {
      className: 'mdc-button',
      onclick: () => {
        this.onyes();
        this.close();
      }
    })
    let buttonNo = Object.assign(document.createElement('button'), {
      className: 'mdc-button',
      onclick: () => this.close()
    })

    buttonYes.innerHTML = `<span class="mdc-button__label">Oui</span>`;
    buttonNo.innerHTML = `<span class="mdc-button__label">Non</span>`;

    div.appendChild(buttonYes);
    div.appendChild(buttonNo);
    this.appendChild(div);
  }
}

window.customElements.define('h-removepopup', RemovePopup);
module.exports = {RemovePopup};
