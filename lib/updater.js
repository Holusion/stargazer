'use strict';

const request = require('request');
const pkgConfig = require('../package.json');
const EventEmitter = require('events');

class Updater extends EventEmitter {
    constructor() {
        super();
    }
    
    checkUpdate() {
        let opt = {
            url: "https://api.github.com/repos/Holusion/stargazer/releases/latest",
            headers: {
                'User-Agent': 'request'
            }
        }
        
        let req = request.get(opt, (error, response, body) => {
            if(!error && response.statusCode == 200) {
                let info = JSON.parse(body);
                if(info.tag_name.replace('v', '') != pkgConfig.version) {
                    this.emit('update_found', info);
                }
            } else {
                console.log(error);
            }
        })
    }
}

module.exports = {Updater};

