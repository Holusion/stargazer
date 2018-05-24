const {ipcRenderer, remote} = require('electron');

const {getList, listenList, dispatchTask, endTask} = require("../store");
const {imageCall, fetch, request, makeIcon} = require("../utils");
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
  render() {
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

    console.log(this.getAttribute('url'));

    const options = {
      port: 3000,
      host: this.getAttribute("url"),
      path: "/system/process/status",
    }
    fetch(options).then(infos => {
      let video_player = JSON.parse(infos);
      for(let i in video_player) {
        this.appendChild(Object.assign(document.createElement('span'), {
          slot: i,
          textContent: video_player[i]
        }));
      }
    });

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
      ipcRenderer.on('download-complete', (e, file) => {
        endTask('download_log');
      })
    })
    this.appendChild(a);
  }
}

module.exports = {ProductInfo};
