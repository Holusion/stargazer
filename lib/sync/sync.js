const io = require('socket.io-client');
const {dispatchPlaylist} = require('../store');

let socket;

function synchronize(url) {
    socket = io('http://'+url+'/playlist');
    socket.on('disconnect', () => {
        // errorBox = errorHandler("danger","Déconnecté.",-1);
    });
    socket.on('disconnected',() => {
        // errorHandler('danger','Socket Disconnected!')
    })
    socket.on('connect',() => {
        // if(errorBox){ errorBox.remove();errorBox = null;}
        socket.emit("get");
    })
    socket.on("current", (data) => {
        dispatchPlaylist('current-playlist', data);
    });
    socket.on('update', (doc) => {
        dispatchPlaylist('update-playlist')
    });
    socket.on('remove', (doc) => {
        dispatchPlaylist('remove-playlist');
    });
    socket.on('insert', (doc) => {
        dispatchPlaylist('insert-playlist')
    })
}

function endSynchronize() {
    if(socket) {
        socket.close();
    }
}

module.exports = {synchronize, endSynchronize}
