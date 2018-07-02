'use strict';

const {PluginItem} = require("./PluginItem");
const toolbar = require("../toolbar");

class PluginList extends HTMLElement {

    constructor() {
        super();
    }

    connectedCallback() {
        this.render();
    }

    render() {
        while(this.firstChild) {
            this.removeChild(this.firstChild);
        }

        let surroundD = document.createElement('div');
        surroundD.id = 'playlist-content';
        Object.assign(surroundD.style, {'margin-top': '16px', 'overflow-y': 'scroll', 'height': 'calc(100vh - 128px)'})
        let d = document.createElement("div");
        Object.assign(d.style, {'display':"flex", 'flex-wrap':'wrap', "padding-left": "16px", 'padding-right': '16px'});
        surroundD.appendChild(d);

        global.plugins.pluginsList.map(info => {
            let elem = Object.assign(new PluginItem(), {
                title: info.name,
                version: info.version,
                description: info.description,
                author: info.author.name
            });

            elem.addEventListener('click', () => {
                surroundD.appendChild(document.createElement("hr"));
                surroundD.appendChild(info.render(toolbar));
            })

            return elem;
        }).forEach(e => d.appendChild(e));

        this.appendChild(surroundD);
    }
}

module.exports = {PluginList}