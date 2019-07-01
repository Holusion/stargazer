const {listenPlaylist, dispatchError, dispatchTask, endTask} = require("../store");
const toolbar = require("../toolbar.js");

const {UploadButton} = require('./UploadButton');
const {UploadBox} = require('./UploadBox');

const {FilterPanel} = require('./FilterPanel');
const {ButtonInOut} = require('./ButtonInOut');
const {PlaylistItem} = require('./PlaylistItem');
const {PlaylistItems} = require('./PlaylistItems');
const {RemovePopup} = require('./RemovePopup');

const {Playlist} = require('./Playlist');
const {Network} = require('../network');

class ProductPanel extends HTMLElement {
  get url() {return this.getAttribute('url')}
  set url(url) {this.setAttribute('url', url)}
  get selectedCards() {return document.querySelectorAll('[selected]')}

  constructor() {
    super();
    this.removeList = [];
  }

  connectedCallback(){
    let network = new Network(this.url);
    try {
      this.playlist = new Playlist(network, this);
    } catch(err) {
      dispatchError(err);
      this.playlist = [];
    }

    if (!this.url){
        this.innerHTML = "<h1>Error : no playlist URL</h1>"
        return;
    }
    this.innerHTML = `<div style="margin-left: 50%;"><load-spinner id="playlist-spinner" active ></load-spinner></div>`
    if (!this.url){
        // console.warn("Can't update product's playlist : No valid URL", this);
    }
    //console.log("Fetching playlist on : ",target);
    if(this.playlist != []) {
      try {
        dispatchTask("create_playlist")
        this.playlist.updatePlaylist().then(() => {
          this.render(this.playlist.medias)
          this.list = this.playlist.medias;
          endTask("create_playlist");
        });
      } catch(err) {
        endTask("create_playlist", err);
        this.list = [];
      }
    }
    this.removeChild(this.firstChild);
    this.updateToolbar();

    listenPlaylist('current-playlist', async () => await this.update());
    listenPlaylist('update-playlist', async () => await this.update());
    listenPlaylist('remove-playlist', async () => await this.update());
    listenPlaylist('insert-playlist', async () => await this.update());

    this.changeFunc = this.listenChange.bind(this)
    document.addEventListener('cardchange', this.changeFunc);
  }

  disconnectedCallback() {
    dispatchTask("close_playlist")
    try {
      if(this.playlist != []) this.playlist.close();
      endTask("close_playlist")
    } catch(err) {
      endTask("close_playlist", err);
    }
    document.removeEventListener('cardchange', this.changeFunc);
    document.body.removeChild(document.querySelector("h-removepopup"));
  }

  async listenChange(evt) {
    const elem = evt.detail.elem;
    let removePopup = document.body.querySelector('h-removepopup');

    switch(evt.detail.action) {
      case 'selected': {
        if(elem.hasAttribute('selected')){
          this.playlist.selectItem(elem);
        } else {
          this.playlist.unselectItem(elem);
        }
        this.updateToolbar();
        this.updateSelectAllButton();
        break;
      }
      case 'start':
        if(elem.start && this.playlist != []) {
          dispatchTask("playlist_play")
          try {
            await this.playlist.playItem(elem);
            endTask("playlist_play")
          } catch(err) {
            endTask("playlist_play", err);
          }
        }
        break;
      case 'removeitem':
        this.removeList.push(elem);
        
        if(removePopup.active) {
          removePopup.visible = true;
        } else {
          elem.visible = false;
        }
        break;
      case 'visible':
        if(elem.visible == "false" && this.playlist != []) {
          dispatchTask("remove_playlist")
          try {
            await this.playlist.removeItem(elem);
            elem.shadowRoot.querySelector('.card').addEventListener("animationend", () => {
              document.querySelector("h-playlist_items").removeChild(elem)
            })
            endTask("remove_playlist");
          } catch(err) {
            endTask("remove_playlist", err);
          }
        }
        this.list = this.playlist instanceof Playlist ? this.playlist.medias : [];
        break;
      case 'active':
        if(evt.detail.oldValue != null && this.playlist != []) {
          dispatchTask("toggle_playlist");
          try {
            await this.playlist.toggleActiveItem(elem);
            endTask("toggle_playlist");
          } catch(err) {
            endTask("toggle_playlist", err)
          }
        }
        break;
    }
  }

  async update() {
    dispatchTask("update_panel")
    if(this.playlist != []) {
      try {
        await this.playlist.updatePlaylist();
      } catch(err) {
        endTask("upadate_panel", err);
      }
    }
    await this.updateCurrent();
    endTask("update_panel");
    // this.list = this.playlist.medias;
  }

  updateCurrent() {
    if(this.playlist != []) {
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
  }

  updateToolbar() {
    let tools = [];

    const openFilterPanel = () => {
      this.querySelector('h-filter').visible = true;
      this.updateToolbar();
    }

    let filter = {id: 'filter', title: `ouvre le le menu de filtre`, func: openFilterPanel}

    const removeFilterPanel = () => {
      tools.push(filter)
      this.querySelector('h-filter').visible = false;
      this.updateToolbar();
    }

    let play = {id: 'play', title: `lance directement le média sélectionné`, func: () => this.selectedCards[0].play.bind(this.selectedCards[0])()};
    let deleteTool = {id: 'delete', title: `supprime définitivement tout les médias sélectionnés`, func: () => this.selectedCards.forEach(e => e.remove())};
    let separator = 'separator';
    let close = {id: 'close', title: `annule les modifications sur le filtre`, func: () => removeFilterPanel()};
    let check = {id: 'check', title: `valide les filtres sélectionnés`, func: () => {
      removeFilterPanel();
      if(this.playlist != []) {
        this.playlist.filterOption = filterpanel.filterOption;
      }

      try {
        this.playlist.updatePlaylist().then(() => this.render(this.playlist.medias));
      } catch(err) {
        dispatchError(err);
      }
    }}
    let toggle_off = {id: 'toggle-off', title: `desactive les médias sélectionnés`, func: () => this.selectedCards.forEach(e => e.desactiveItem())}
    let toggle_on = {id: 'toggle-on', title: `active les médias sélectionnés`, func: () => this.selectedCards.forEach(e => e.activeItem())}

    if(this.selectedCards.length == 1) {
      tools.push(play);
    }
    if(this.selectedCards.length > 0) {
      tools.push(toggle_off);
      tools.push(toggle_on);
      tools.push(deleteTool);
    }
    tools.push(separator);

    let filterpanel = this.querySelector('h-filter');
    if(filterpanel && filterpanel.visible == "true") {
      tools.push(close);
      tools.push(check);
    } else {
      tools.push(filter)
    }

    toolbar.render(tools);
  }
  async upload() {
    if(this.playlist != []) {
      try {
        await this.playlist.upload();
      } catch(err) {
        dispatchError(err);
      }
      let res = this.playlist.medias.filter(curr => this.list.filter(other => curr.name == other.name).length == 0);
      let playlistPanel = document.querySelector("h-playlist_items");
      res.forEach(info => {
        let i = this.playlist.medias.indexOf(info);
        let obj = Object.assign(new PlaylistItem(),{
          title: decodeURIComponent(escape(info.name)),
          id: decodeURIComponent(escape(info.name)),
          url: this.getAttribute("url"),
          image: `/medias/${decodeURIComponent(escape(info.name))}`,
          name: decodeURIComponent(escape(info.name)),
          active: info.active,
          path: info.path,
          rank: info.rank,
          slot: 'items',
          visible: 'true'
        })
        playlistPanel.insertBefore(obj, playlistPanel.childNodes[i + 1]);
      })
    }
  }

  updateSelectAllButton() {
    document.querySelector(".selectAll").render();
  }

  render(list){
    //Reset self content.
    if(this.querySelector('#playlist-content')) {
      this.removeChild(this.querySelector('#playlist-content'))
    }

    document.body.appendChild(Object.assign(new RemovePopup(), {
      onyes: () => {
        // console.log(this.removeList);
        this.removeList.forEach(e => e.visible = false)
        this.removeList = [];
      },
      onno: () => {
        this.removeList = [];
      }
    }));

    let surroundD = document.createElement('div');
    surroundD.id = 'playlist-content';
    Object.assign(surroundD.style, {'margin': 'auto 16px', 'overflow-y': 'scroll', 'height': 'calc(100vh - 128px)'})

    if(this.playlist != []) {
      let filterPanel = new FilterPanel(this.playlist.filterOption)
      surroundD.appendChild(filterPanel)

      let buttonSelectAll = new ButtonInOut();
      buttonSelectAll.inText = "Tout sélectionner";
      buttonSelectAll.outText = "Tout déselectionner";
      buttonSelectAll.className = "selectAll";
      buttonSelectAll.inFunc = () => document.querySelectorAll("h-item").forEach(e => e.setAttribute("selected", true));
      buttonSelectAll.outFunc = () => document.querySelectorAll("h-item").forEach(e => e.removeAttribute("selected"));
      buttonSelectAll.predicate = () => list.filter(elem => elem.selected).length === 0;
      surroundD.appendChild(buttonSelectAll);
      
      let filterList = list.map((l)=>{delete l._id; return l;}).filter(info => this.playlist.filter(info));
      let items = new PlaylistItems(filterList)
      items.url = this.getAttribute("url");
      items.onupload = async ()=>await this.upload();
      surroundD.appendChild(items);
    }

    //Upload is a neutral web component that just react to clicks. We need to style it a bit
    let uploadButton = new UploadButton();
    uploadButton.url = this.getAttribute('url');
    uploadButton.onchange = async ()=>await this.upload();
    uploadButton.setAttribute("visible", true);
    surroundD.appendChild(uploadButton);

    let uploadBox = new UploadBox();
    uploadBox.url = this.getAttribute('url');
    uploadBox.onchange = async () => {
      await this.upload();
      uploadBox.visible = false;
    }
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
    surroundD.appendChild(uploadBox);

    this.appendChild(surroundD);
  }
}

module.exports = {ProductPanel}
