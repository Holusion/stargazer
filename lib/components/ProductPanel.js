const {listenPlaylist} = require("../store");
const toolbar = require("../toolbar.js");

const {UploadCard} = require('./UploadCard');
const {UploadButton} = require('./UploadButton');
const {UploadBox} = require('./UploadBox');

const {FilterPanel} = require('./FilterPanel');
const {PlaylistItem} = require('./PlaylistItem');

const {Playlist} = require('./Playlist');
const {Network} = require('../network');

class ProductPanel extends HTMLElement {
  get url() {return this.getAttribute('url')}
  set url(url) {this.setAttribute('url', url)}  
  get selectedCards() {return document.querySelectorAll('[selected]')}

  constructor() {
    super();
  }
    
  connectedCallback(){
    let network = new Network(this.url);
    this.playlist = new Playlist(network, this);

    if (!this.url){
        this.innerHTML = "<h1>Error : no playlist URL</h1>"
        return;
    }
    this.innerHTML = `<div style="margin-left: 50%;"><load-spinner id="playlist-spinner" active ></load-spinner></div>`
    if (!this.url){
        console.warn("Can't update product's playlist : No valid URL", this);
    }
    //console.log("Fetching playlist on : ",target);
    this.playlist.updatePlaylist().then(_ => this.render(this.playlist.medias));
    this.removeChild(this.firstChild);
    this.updateToolbar();

    listenPlaylist('current-playlist', async e => await this.update());
    listenPlaylist('update-playlist', async e => await this.update());
    listenPlaylist('remove-playlist', async e => await this.update());
    listenPlaylist('insert-playlist', async e => await this.update());
    
    this.changeFunc = this.listenChange.bind(this)
    document.addEventListener('cardchange', this.changeFunc);
  }

  disconnectedCallback() {
    this.playlist.close();
    document.removeEventListener('cardchange', this.changeFunc);
  }

  async listenChange(evt) {
    const elem = evt.detail.elem;
    switch(evt.detail.action) {
      case 'selected': {
        if(elem.hasAttribute('selected')){
          this.playlist.selectItem(elem);
        } else {
          this.playlist.unselectItem(elem);
        }
        this.updateToolbar(this.playlist.medias);
      }
      case 'start':
        if(elem.start) {
          await this.playlist.playItem(elem);
        }
        break;
      case 'hidden':
        await this.playlist.removeItem(elem);
        this.render(this.playlist.medias);
        break;
      case 'active':
        if(evt.detail.oldValue != null) {
          await this.playlist.toggleActiveItem(elem);
        }
        break;
    }
  }

  async update() {
    await this.playlist.updatePlaylist();
    await this.updateCurrent();
  }

  updateCurrent() {
    for(let e of this.playlist.medias) {
      let elem = document.getElementById(e.name);
      if(elem) {
        if(e.current) elem.current = e.current;
        else {
          elem.removeAttribute('current');
        }
      }
    }
  }

  updateToolbar() {
    toolbar.clean();

    if(this.selectedCards.length == 1) {
      toolbar.addTool('play', `lance directement le média sélectionné`, this.selectedCards[0].play.bind(this.selectedCards[0]));
    }
    if(this.selectedCards.length > 0) {
      toolbar.addTool('delete', `supprime définitivement tout les médias sélectionnés`, () => this.selectedCards.forEach(e => e.remove()));
    }
    let tmpFilterOption = {};
    toolbar.addSeparator();
    let filterpanel = this.querySelector('h-filter');
    const openFilterPanel = () => {
      this.insertBefore(new FilterPanel(this.playlist.filterOption), this.firstChild);
      toolbar.removeTool('filter');
      this.updateToolbar(this.selectedCards);
    }
    if(filterpanel) {
      const removeFilterPanel = () => {
        toolbar.removeTool('close');
        toolbar.removeTool('check');
        toolbar.addTool('filter', `ouvre le le menu de filtre`, openFilterPanel);
        this.removeChild(filterpanel);
      }
      toolbar.addTool('close', `annule les modifications sur le filtre`, removeFilterPanel);
      toolbar.addTool('check', `valide les filtres sélectionnés`, () => {
        removeFilterPanel();
        this.playlist.filterOption = filterpanel.filterOption;
        this.playlist.updatePlaylist();
      });
    } else {
      toolbar.addTool('filter', `ouvre le le menu de filtre`, openFilterPanel)
    }
    toolbar.render();
  }
  async upload() {
    await this.playlist.upload();
    this.render(this.playlist.medias);
  }

  render(list){
    //Reset self content.
    if(this.querySelector('#playlist-content')) {
      this.removeChild(this.querySelector('#playlist-content'))
    }
    let surroundD = document.createElement('div');
    surroundD.id = 'playlist-content';
    Object.assign(surroundD.style, {'margin-top': '16px', 'overflow-y': 'scroll', 'height': 'calc(100vh - 128px)'})
    let d = document.createElement("div");
    Object.assign(d.style, {'display':"flex", 'flex-wrap':'wrap', "padding-left": "16px", 'padding-right': '16px', 'position': 'relative'});
    surroundD.appendChild(d);

    list.map((l)=>{delete l._id; return l;}).filter(info => this.playlist.filter(info)).map((info)=>{
      return Object.assign(new PlaylistItem(),{
        title: decodeURIComponent(escape(info.name)),
        id: decodeURIComponent(escape(info.name)),
        url: this.getAttribute("url"),
        image: `/medias/${decodeURIComponent(escape(info.name))}`,
        name: decodeURIComponent(escape(info.name)),
        active: info.active,
        path: info.path,
        rank: info.rank
      })
    }).forEach((elem)=>{
      d.appendChild(elem);
    });
    //Upload is a neutral web component that just react to clicks. We need to style it a bit
    let uploadButton = new UploadButton();
    uploadButton.url = this.getAttribute('url');
    uploadButton.onchange = async (evt)=>await this.upload();
    d.appendChild(uploadButton);
    this.appendChild(surroundD);

    let uploadCard = new UploadCard();
    uploadCard.url = this.getAttribute('url');
    uploadCard.onchange = async (evt)=>await this.upload();
    d.insertBefore(uploadCard, d.firstChild);
    surroundD.addEventListener("scroll", () => {
      if(!document.querySelector(".uploaderCard") || !document.querySelector(".uploaderButton")) return;
      let box = document.querySelector(".uploaderCard").getBoundingClientRect();
      if(box.bottom <= 160) {
        uploadButton.visible = true;
      } else {
        uploadButton.visible = false;
      }
    }, false);

    let uploadBox = new UploadBox();
    uploadBox.url = this.getAttribute('url');
    uploadBox.onchange = async (evt) => await this.upload();
    document.querySelector("body").ondragenter = (ev) => {
      ev.preventDefault();
      uploadBox.visible = true;
    }
    document.querySelector("body").ondragleave = (ev) => {
      ev.preventDefault();
      if(!ev.clientX && !ev.clientY) {
        uploadBox.visible = false;
      }
    }
    d.appendChild(uploadBox);
  }
}

module.exports = {ProductPanel}