'use strict'

const popup = require('../templates/popup')

class RemovePopup extends HTMLElement {
  static get observedAttributes(){return ["visible"]}
  set visible(val) {this.setAttribute('visible', val)}
  get visible() {return this.getAttribute('visible')}

  constructor() {
    super();
    let dom = this.attachShadow({mode: 'open'});
    dom.appendChild(popup());

    this.active = true;
  }

  connectedCallback() {
    this.render();
  }

  close() {
    this.visible = false;
  }

  render() {
    this.innerHTML = `
      <span slot='content' style="margin-bottom: 32px;">Voulez vous vraiments supprimer ces fichiers ?</span>
      <div slot="content" class="mdc-form-field" style="margin-bottom: 16px;">
        <div class="mdc-checkbox" style="padding: 0;">
          <input type="checkbox" class="mdc-checkbox__native-control" id="selector_remove"/>
          <div class="mdc-checkbox__background" style="left: 0; top: 0; width:100%; height: 100%;">
              <svg class="mdc-checkbox__checkmark" viewBox="0 0 24 24">
              <path class="mdc-checkbox__checkmark-path"
                    fill="none"
                    stroke="white"
                    d="M1.73,12.91 8.1,19.28 22.79,4.59"/>
            </svg>
            <div class="mdc-checkbox__mixedmark"></div>
          </div>
        </div>
        <label slot="content" for="selector_remove" style="margin-left: 4px;">Ne plus afficher ce message</label>
      </div>
    `

    let selector_remove = this.querySelector('#selector_remove');
    selector_remove.addEventListener("change", () => {
      selector_remove.checked ? this.active = false : this.active = true;
    })

    let div = Object.assign(document.createElement('div'), {
      slot:"content"
    })
    let buttonYes = Object.assign(document.createElement('button'), {
      className: 'mdc-button mdc-button--raised',
      onclick: () => {
        this.onyes();
        this.close();
      }
    })
    let buttonNo = Object.assign(document.createElement('button'), {
      className: 'mdc-button',
      onclick: () => {
        this.onno();
        this.close()
      }
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
