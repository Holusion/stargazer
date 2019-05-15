'use strict';

const card = require('../templates/card');

class PluginItem extends HTMLElement {
    static get observedAttributes(){return ['name','author','version']}
    
    constructor() {
        super();
        let dom = this.attachShadow({mode: 'open'});
        dom.appendChild(card(`
        .playlist-card{
            background-color:#103040;
            display:flex;
            alignItems:center;
            justifyContent:center;
          }
          .card__title{
            background-color: rgba(0,0,0,0);
          }
          .left-action{
              display: none;
              visibility: hidden;
          }
          .middle-action{
              display: none;
              visibility: hidden;
          }
          .right-action{
              top: 4px;
              right: 4px;
          }
        `));
    }

    connectedCallback() {
        this.render();
    }

    render() {
        this.appendChild(Object.assign(document.createElement("span"),{
            slot: "name",
            style: "font-size: 36px;",
            textContent: this.title
        }));

        this.appendChild(Object.assign(document.createElement("span"), {
            slot: 'right-action',
            style: 'margin-right: 2px; margint-top: 2px;',
            textContent: this.version
        }));
    }
}

module.exports = {PluginItem};