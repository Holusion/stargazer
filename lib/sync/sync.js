const io = require('socket.io-client');
const {dispatchPlaylist} = require('../store');

function synchronize(url) {
    this.socket = io('http://'+url+'/playlist');
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

module.exports = {synchronize}
