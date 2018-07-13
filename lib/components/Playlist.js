'use strict';

class Playlist {
  constructor(network, view) {
    this.network = network;
    this.view = view;

    network.getPlaylist().then(e => {
      this.medias = e //{name, current, path, rank, selected, active}
      this.filterOption = {};
      this.network.synchronize();
    });
  }
  close() {
    this.network.endSynchronize();
  }
  upload() {
    console.log("UPLOADER changed");
    this.updatePlaylist();
  }
  async updatePlaylist() {
    this.medias = await this.network.getPlaylist();
    let info = await this.network.getCurrent();
    
    this.view.render(this.medias);
    let elem = this._getMediaByName(info.name);
    if(elem) {
      elem.current = 'true';
      this.updateCurrent(info.name);
      this.current = info.name;
    }
  }
  updateCurrent(name) {
    if(this.current && this.current != name && this.medias) {
      this.current = name;
      this._getMediaByName(name).current = true;
    }
    
    for(let c of this.medias) {
      if(this.current && c && c.name != this.current) {
        delete c.current
      }
    }
    this.view.updateCurrent();
  }

  filter(info) {
    if(Object.keys(this.filterOption).length == 0) return true;
    return Object.keys(this.filterOption).reduce((previous, key) => previous || this.filterOption[key](info), false);
  }
  async playItem(elem) {
    if(elem.active) {
      await this.network.play(elem);
      elem.start = 'false';
      this.updateCurrent(elem.name);
    }
  }
  async removeItem(elem) {
    let res = await this.network.remove(elem);
    if(!res || res instanceof Error) {
      elem.hidden = false;
    } else {
      this.updatePlaylist();
    }
  }
  async toggleActiveItem(elem) {
    return await this.network.toggleActivation(elem);
  }
  selectItem(elem) {
    this._getMediaByName(elem.name).selected = true;
  }
  unselectItem(elem) {
    delete this._getMediaByName(elem.name).selected;
  }

  _getMediaByName(name) {
    return this.medias.filter(e => e.name == name)[0];
  }
}

module.exports = {Playlist};
