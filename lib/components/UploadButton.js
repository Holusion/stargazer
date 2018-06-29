'use strict';

const fab = require('../templates/fab');

const Upload = require("../Upload");
const Icon = require("../Icon");

class UploadButton extends Upload {
  static get observedAttributes(){return ["visible"]}
  set visible(val) {this.setAttribute('visible', val)}
  get visible() {this.getAttribute('visible')}
  constructor() {
    super(fab());
    this.hidden = true;
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    document.dispatchEvent(new CustomEvent('uploadbuttonchange', {detail: {elem: this, action: name, value: newValue, oldValue: oldValue}}))
  }

  render() {
    let ic = new Icon("upload");
    ic.slot = 'content';
    this.appendChild(ic);
    this.setAttribute("url", this.url);
    this.classList.add("uploaderButton");
  }
}

window.customElements.define('h-uploadfab', UploadButton);
module.exports = {UploadButton}
