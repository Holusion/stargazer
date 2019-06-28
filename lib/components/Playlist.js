'use strict';

class Playlist {
  constructor(network) {
    this.network = network;

    network.getPlaylist().then(e => {
      this.medias = e //{name, current, path, rank, selected, active}
      this.filterOption = {};
      this.network.synchronize();
    });
  }
  close() {
    this.network.endSynchronize();
  }
  async upload() {
    await this.updatePlaylist();
  }
  async updatePlaylist() {
    this.medias = await this.network.getPlaylist();
    let info = await this.network.getCurrent();
    if(info) {
      let elem = this._getMediaByName(info.name);
      elem.current = 'true';
      this.updateCurrent(info);
      this.current = info.name;
    }
  }
  updateCurrent(info) {
    if(this.current && this.current != info.name && this.medias) {
      this.current = info.name;
      this._getMediaByName(info.name).current = true;
    }

    for(let c of this.medias) {
      if(this.current && c && c.name != this.current) {
        delete c.current
      }
    }
  }

  filter(info) {
    if(!this.filterOption || !Object.keys(this.filterOption) || Object.keys(this.filterOption).length == 0) return true;
    return Object.keys(this.filterOption).reduce((previous, key) => previous || this.filterOption[key](info), false);
  }
  async playItem(elem) {
    if(elem.active) {
      await this.network.play(elem);
      elem.start = 'false';
      this.updateCurrent(elem);
    }
  }
  async removeItem(elem) {
    let res = await this.network.remove(elem);
    if(!res || res instanceof Error) {
      elem.hidden = false;
    } else {
      await this.updatePlaylist();
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
  selectAllItem() {
    this.medias.forEach(this.selectItem.bind(this));
  }
  unselectAllItem() {
    this.medias.forEach(this.unselectItem.bind(this));
  }

  _getMediaByName(name) {
    return this.medias.filter(e => e.name == name)[0];
  }
}

module.exports = {Playlist};
