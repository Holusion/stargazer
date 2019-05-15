'use strict';

const {ipcRenderer} = require('electron');

const {dispatchTask, endTask, dispatchInfo} = require("../store");
const infos = require("../templates/infos");

class ProductInfo extends HTMLElement {
  get observedAttributes(){return ["version", "url"]}
  get url() {return this.getAttribute('url')}
  set url(url) {this.setAttribute('url', url)}
  get version() {return this.getAttribute('version')}
  set version(version) {this.setAttribute('version', version)}
  constructor() {
    super();
    let dom = this.attachShadow({mode: 'open'});
    dom.appendChild(infos());
  }
  connectedCallback(){
    this.render();
  }
  attributeChangedCallback(){
    this.render();
  }
  async render() {
    const url = this.getAttribute("url");
    const version = this.getAttribute("version");
    this.appendChild(Object.assign(document.createElement('span'), {
      slot: "url",
      textContent: url
    }));
    this.appendChild(Object.assign(document.createElement('span'), {
      slot: "version",
      textContent: version
    }));

    // console.log(this.getAttribute('url'));

    let response = await fetch(`http://${this.getAttribute('url')}/system/process/status`);
    let video_player = await response.json();
    for(let i in video_player) {
      this.appendChild(Object.assign(document.createElement('span'), {
        slot: i,
        textContent: video_player[i]
      }));
    }

    const a = (Object.assign(document.createElement('a'), {
      slot: 'log',
      textContent: 'Télécharger les logs du controller',
      className: 'log'
    }));

    a.addEventListener('click', () => {
      dispatchTask('download_log');
      ipcRenderer.send('download', {
        url: `http://${this.getAttribute('url')}:3000/system/log`,
        onmouseover: 'function() {this.style="color: #666"}'
      })
      ipcRenderer.on('download-complete', () => {
        endTask('download_log');
        dispatchInfo("Le fichier log a été téléchargé", "Il se trouve dans le dossier de téléchargement par défaut");
      })
    })
    this.appendChild(a);
  }
}

module.exports = {ProductInfo};
