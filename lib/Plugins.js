'use strict';

const fs = require('fs');
const path = require('path');
const {dispatchList, listenTasks, dispatchTask, listenError, listenInfo, endTask} = require("./store");
const constant = require("../constants");

class Plugins {
    constructor() {

    }

    loadAllPlugins() {
        const isDirectory = source => fs.lstatSync(source).isDirectory();
        let pluginsPath = fs.readdirSync(constant.PLUGINS_PATH).map(name => path.join(constant.PLUGINS_PATH, name)).filter(isDirectory);
        this.pluginsList = pluginsPath.map(path => {
            try {
                return require(path)
            } catch(err) {
                endTask('plugin_listening', err)
            }
        });
    }
}

module.exports = {Plugins};