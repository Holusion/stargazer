'use strict';

const fs = require('fs');
const path = require('path');
const {dispatchList, listenTasks, dispatchTask, listenError, listenInfo, endTask} = require("./store");
const constant = require("../constants");
const EventEmitter = require('events');

class Plugins extends EventEmitter {
    constructor() {
        super();
        this.previousFiles = [];
        this.files = [];
        this.pluginsList = [];
    }

    findPlugins() {
        const isDirectory = source => fs.lstatSync(source).isDirectory();
        setInterval(() => {
            this.files = fs.readdirSync(constant.PLUGINS_PATH).map(name => path.join(constant.PLUGINS_PATH, name)).filter(isDirectory);
            this.files.filter(e => !this.previousFiles.includes(e)).forEach(e => this.emit('addPlugin', e));
            this.previousFiles.filter(e => !this.files.includes(e)).forEach(e => this.emit('removePlugin', this.previousFiles.indexOf(e)));
            
            this.previousFiles = this.files;
        }, 1000);
    }
    
    managePlugins() {
        this.on('addPlugin', pluginPath => {
            let infos = JSON.parse(fs.readFileSync(path.join(pluginPath, 'package.json'), {encoding: 'utf8'}));
            Object.assign(infos, require(pluginPath));
            this.pluginsList.push(infos);
            console.log(this.pluginsList);
        })
    
        this.on('removePlugin', index => {
            delete this.pluginsList[index]
            this.pluginsList = this.pluginsList.filter(n => n);
            console.log('Remove', this.pluginsList);
        })
    }
}

module.exports = {Plugins};