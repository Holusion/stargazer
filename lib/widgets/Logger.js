'use strict';

const winston = require('winston');
const path = require('path');
const fs = require('fs');

class Logger {
  constructor() {
    const logDir = path.resolve(this.filepath, 'holusion-stargazer');
    if(!fs.existsSync(path.resolve(logDir))) {
      fs.mkdirSync(logDir);
    }
    winston.add(winston.transports.File, { filename: path.resolve(logDir, 'log.log'), json: false })
  }
  get filepath(){
    return process.env.APPDATA || path.resolve(process.env.HOME, process.platform == 'darwin' ? 'Library/Preferences' : '.config');
  }
  push(err) {
    let message = `${err.name}\n${err.message}\n${err.stack}`;
    winston.error(message);
  }
}

module.exports = {Logger};
