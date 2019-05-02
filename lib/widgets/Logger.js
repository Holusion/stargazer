'use strict';

const errorHandler = require("../errorHandler");
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
    console.error(err.detail);
    const readableError = errorHandler.parseError(err.detail);
    let message = `${readableError.title}\n`;
    for (var i = 0; i < readableError.content.length; i++) {
      message += `-\t${readableError.content[i].context} in file ${readableError.content[i].file} at line: ${readableError.content[i].line}\n`;
    }
    winston.error(message);
  }
}

module.exports = {Logger};
