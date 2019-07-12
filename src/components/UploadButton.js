'use strict';

const fab = require('../templates/fab');

const Upload = require("../Upload");
const Icon = require("../Icon");

class UploadButton extends Upload {
  static get observedAttributes(){return ["visible"]}
  set visible(val) {this.setAttribute('visible', val)}
  get visible() {return this.getAttribute('visible')}
  constructor() {
    super(fab());
  }

  connectedCallback() {
    this.render();
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
