'use strict'

const io = require('socket.io-client');
const {dispatchPlaylist} = require('./store');
const {imageCall, fetch, request} = require("./utils");

class Network {
    
    constructor(url) {
        this.url = url;
        imageCall(this.url);
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
        let options = {
            port: 3000,
            host: this.url,
            path: encodeURI(targetPath),
            method: method.toUpperCase()
        }
        try {
            let res = await request(options, opts.json ? JSON.stringify(opts.json) : null);
            if(res.statusCode === 200) {
                endTask(targetPath)
                return res;
            } else {
                endTask(targetPath, new Error(`${options.method}: ${options.host}:${options.port}/${options.path} - (${res.statusCode}) ${res.statusMessage}`));
                return res;
            }
        } catch(err) {
            endTask(targetPath, err);
            return res;z
        }
    }
    
    async fetchPlaylist() {
        this.playlist.updatePlaylist(r, e);
    }
    
    async getPlaylist() {
        const opt = {
            port: 3000,
            host: this.url,
            path: "/playlist",
        }
        let r = []
        try {
          let res = await fetch(opt);
          r = JSON.parse(res);
        } catch(e) {
          if (e.type != 'invalid-json'){
            console.warn("Invalid response : ",e);
            endTask('no_response', e);
          }
        }
        return r;
    }
    
    async getCurrent() {
        const options = {
            port: 3000,
            host: this.url,
            path: "/control/current",
        }
        let res = await fetch(options)
        return JSON.parse(decodeURIComponent(escape(res)));
    }
    
    toggleActivation(elem) {
        let info = {name: elem.name, path: elem.path, rank: elem.rank}
        return this.requestUpdate("put", "/playlist", Object.assign(info,{active:elem.active}));
    }
    
    play(elem) {
        return this.requestUpdate("put", `/control/current/${elem.name}`);
    }
    
    remove(elem) {
        return this.requestUpdate("delete", `/medias/${elem.name}`, null);
    }
}


module.exports = {Network}
