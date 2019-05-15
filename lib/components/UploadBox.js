'use strict'

const uploadbox = require('../templates/uploadbox');
const Upload = require("../Upload");
const Icon = require("../Icon");

class UploadBox extends Upload {
    static get observedAttributes(){return ["visible"]}
    set visible(val) {this.setAttribute('visible', val)}
    get visible() {return this.getAttribute('visible')}

    constructor() {
        super(uploadbox());
        // this.hidden = true;
        this.visible = false;
    }

    connectedCallback() {
        this.render();
    }
    
    attributeChangedCallback(name, oldValue, newValue) {
        document.dispatchEvent(new CustomEvent('uploadbuttonchange', {detail: {elem: this, action: name, value: newValue, oldValue: oldValue}}))
    }

    render() {
        let ic = new Icon("uploadbox");
        ic.slot = 'content';
        ic.setAttribute('icon-style', "width:100;height:100;fill:var(--mdc-theme-secondary)");
        this.appendChild(ic);
        this.setAttribute("url", this.url);
    }
}

window.customElements.define('h-uploadbox', UploadBox);
module.exports = {UploadBox};