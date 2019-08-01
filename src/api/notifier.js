let list = [];

function pushNotification(obj) {
    if(list.length >= 3) {
        removeNotification(list[0], 1000)
    }
    list.push(obj);
}

function pushError(err) {
    if(err) {
        const obj = {id: '_' + Math.random().toString(36).substr(2, 9), title: err.message, content: "Cliquez pour en savoir plus", visible: true}
        pushNotification(obj);
    }
}

function pushInfo(info) {
    if(info) {
        const obj = {id: '_' + Math.random().toString(36).substr(2, 9), title: info.title, content: info.message, visible: true}
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
    removeNotification,
    getList
}