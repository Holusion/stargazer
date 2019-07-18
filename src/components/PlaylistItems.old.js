'use strict'

const {PlaylistItem} = require("./PlaylistItem");
const {UploadCard} = require('./UploadCard')

const playlistItems = require('../templates/playlist');

class PlaylistItems extends HTMLElement {
  static get observedAttributes(){return ['url']}
  get url() {return this.getAttribute('url')}
  set url(url) {this.setAttribute('url', url)}

  constructor(list) {
    super();
    let dom = this.attachShadow({mode: 'open'});
    dom.appendChild(playlistItems());
    this.list = list;
  }

  connectedCallback() {
    this.render();
  }

  render() {
    let uploadCard = new UploadCard();
    uploadCard.url = this.getAttribute('url');
    uploadCard.slot = 'items';
    uploadCard.onchange = this.onupload;
    this.appendChild(uploadCard)

    if(this.list && typeof this.list == 'object') {
      this.list.map((info)=>{
        return Object.assign(new PlaylistItem(),{
          title: info.name,
          id: info.name,
          url: this.getAttribute("url"),
          image: `/medias/${info.name}`,
          name: info.name,
          active: info.active,
          path: info.path,
          rank: info.rank,
          slot: 'items'
        })
      }).forEach((elem)=>{
        this.appendChild(elem);
      });
    }
  }
}

module.exports = {PlaylistItems}
