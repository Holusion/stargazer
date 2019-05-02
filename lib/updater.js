'use strict';

const pkgConfig = require('../package.json');
const EventEmitter = require('events');

class Updater extends EventEmitter {
    constructor() {
        super();
    }
    
    checkUpdate() {
        fetch("https://api.github.com/repos/Holusion/stargazer/releases/latest", {
            headers: new Headers({'User-Agent': 'request'})
        }).then(response => {
            if(response.status === 200) {
                return response.json()
            } else {
                return Promise.reject(new Error(response.status, response.statusText));
            }
        }).then(info => {
            if(info.tag_name.replace('v', '') != pkgConfig.version) {
                this.emit('update_found', info);
            }
        }).catch(error => {
            console.log(error);
        })
    }
}

module.exports = {Updater};

