'use strict'

const io = require('socket.io-client');
const {dispatchPlaylist} = require('./store');

class Network {

    constructor(url) {
        this.url = url;
    }

    synchronize() {
        this.socket = io('http://'+this.url+'/playlist');
        this.socket.on('disconnect', () => {
            // errorBox = errorHandler("danger","Déconnecté.",-1);
        });
        this.socket.on('disconnected',() => {
            // errorHandler('danger','Socket Disconnected!')
        })
        this.socket.on('connect',() => {
            // if(errorBox){ errorBox.remove();errorBox = null;}
            this.socket.emit("get");
        })
        this.socket.on("current", (data) => {
            dispatchPlaylist('current-playlist', data);
        });
        this.socket.on('update', (doc) => {
            dispatchPlaylist('update-playlist')
        });
        this.socket.on('remove', (doc) => {
            dispatchPlaylist('remove-playlist');
        });
        this.socket.on('insert', (doc) => {
            dispatchPlaylist('insert-playlist')
        })
    }

    endSynchronize() {
        if(this.socket) {
            this.socket.close();
        }
    }

    async requestUpdate(method, targetPath, body){
        let opts = {};
        dispatchTask(targetPath);
        if (typeof body === "object"){
            opts.json = body;
        }
        let headers = new Headers({
            'Content-Type': 'application/json'
        })
        let options = {
            method: method.toUpperCase(),
            headers: headers,
        }

        if(body) {
            options.body = JSON.stringify(body)
        }

        try {
            let res = await fetch(`http://${this.url}${encodeURI(targetPath)}`, options);
            if(res.status === 200) {
                endTask(targetPath)
                return res;
            } else {
                endTask(targetPath, new ErrorWrapper(`HTTPError: ${res.status}`, new Error(`${options.method}: ${this.url}${targetPath} - (${res.status}) ${res.statusText}`)));
                return res;
            }
        } catch(err) {
            endTask(targetPath, new ErrorWrapper(`HTTPError: ${res.status}`, err));
            return res;
        }
    }

    async fetchPlaylist() {
        this.playlist.updatePlaylist(r, e);
    }

    async getPlaylist() {
        let r = []
        try {
          let res = await fetch(`http://${this.url}/playlist`);
          if(res) {
              r = await res.json();
          }
        } catch(e) {
          if (e.type != 'invalid-json'){
            console.warn("Invalid response : ",e);
            endTask('no_response', e);
          }
        }
        return r;
    }

    async getCurrent() {
        let res = await fetch(`http://${this.url}/control/current`);
        if(res) {
            return await res.json();
        }
    }

    async toggleActivation(elem) {
        let info = {name: elem.name, path: elem.path, rank: elem.rank}
        return await this.requestUpdate("put", "/playlist", Object.assign(info,{active:elem.active}));
    }

    async play(elem) {
        return await this.requestUpdate("put", `/control/current/${elem.name}`);
    }

    async remove(elem) {
        return await this.requestUpdate("delete", `/medias/${elem.name}`, null);
    }
}


module.exports = {Network}
