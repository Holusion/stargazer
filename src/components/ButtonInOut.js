'use strict'

const buttoninout = require("../templates/buttoninout");

class ButtonInOut extends HTMLElement {

    static get observedAttributes(){return ['inFunc', 'outFunc', 'inText', 'outText']}
    set inText(val) {this.setAttribute('inText', val)}
    get inText() {return this.getAttribute('inText')}
    set outText(val) {this.setAttribute('outText', val)}
    get outText() {return this.getAttribute('outText')}

    constructor() {
        super();

        let dom = this.attachShadow({mode: 'open'});
        dom.appendChild(buttoninout());
    }
    
    connectedCallback() {
        this.render();
        
        this.addEventListener("click", () => {
            this.update();
        });
    }
    
    update() {
        this.predicate() ? this.inFunc() : this.outFunc();
    }

    clean() {
        while(this.firstChild) {
            this.removeChild(this.firstChild);
        }
    }

    render() {
        this.clean();
        this.appendChild(Object.assign(document.createElement("span"), {
            slot: "label",
            textContent: this.predicate() ? this.inText : this.outText,
            className: "mdc-button__label"
        }))
    }
}

module.exports = {ButtonInOut};
window.customElements.define("h-buttoninout", ButtonInOut);