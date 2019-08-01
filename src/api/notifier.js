import { remote } from "electron";

let list = [];

function pushNotification(obj) {
    if(list.length >= 3) {
        removeNotification(list[0], 1000)
    }
    list.push(obj);
}

function pushError(err) {
    if(err) {
        const onClick = () => {
            remote.dialog.showMessageBox({
                title: err.name,
                type: 'error',
                message: err.message,
                detail: `Details:\n${err.stack}`,
                buttons: ['OK']
            });
        }
        const obj = {id: '_' + Math.random().toString(36).substr(2, 9), title: err.message, content: "Cliquez pour en savoir plus", visible: true, onClick: onClick}
        pushNotification(obj);
    }
}

function pushInfo(info) {
    if(info) {
        const obj = {id: '_' + Math.random().toString(36).substr(2, 9), title: info.title, content: info.message, visible: true}
        pushNotification(obj);
    }
}

function pushUpdater(info) {
    if(info) {
        const onClick = () => {
            let shell = require('electron').shell;
            shell.openExternal(info.html_url);
        }
        const obj = {
            id: '_' + Math.random().toString(36).substr(2, 9), 
            title: `Nouvelle mise à jour : ${info.tag_name}`, 
            content: "Cliquez pour télécharger la mise à jour", 
            visible: true, 
            icon: 'refresh', 
            onClick: onClick
        }
        pushNotification(obj);
    }
}

function removeNotification(item, time) {
    item.visible = false;
    setTimeout(() => {
        list = list.filter(elem => elem !== item);
    }, time);
}

function getList() {
    return list;
}

export {
    pushError,
    pushInfo,
    pushNotification,
    pushUpdater,
    removeNotification,
    getList
}