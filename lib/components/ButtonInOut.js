'use strict'

const buttoninout = require("../templates/buttoninout");

class ButtonInOut extends HTMLElement {

    static get observedAttributes(){return ['in', 'inFunc', 'outFunc', 'inText', 'outText', 'predicate']}
    set in(val) {this.setAttribute('in', val)}
    get in() {return this.getAttribute('in')}
    set inText(val) {this.setAttribute('inText', val)}
    get inText() {return this.getAttribute('inText')}
    set outText(val) {this.setAttribute('outText', val)}
    get outText() {return this.getAttribute('outText')}

    constructor() {
        super();

        let dom = this.attachShadow({mode: 'open'});
        dom.appendChild(buttoninout());

        this.in = 'true';
    }
    
    connectedCallback() {
        this.render();

        this.addEventListener("click", () => {
            this.in == 'true' ? this.inFunc() : this.outFunc();
            this.in = this.in == 'false';
        });

    }

    attributeChangedCallback(name) {
        if(name == "in") {
            this.render();
        }
    }

    render() {
        while(this.firstChild) {
            this.removeChild(this.firstChild);
        }
        this.appendChild(Object.assign(document.createElement("span"), {
            slot: "label",
            textContent: this.in == 'true' ? this.inText : this.outText,
            className: "mdc-button__label"
        }))
    }
}

module.exports = {ButtonInOut};
window.customElements.define("h-buttoninout", ButtonInOut);