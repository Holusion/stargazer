'use strict';

const errorHandler = require("../errorHandler");

class Logger {
  constructor() {

  }

  push(err) {
    const readableError = errorHandler.parseError(err);
    let message = "";
    for (var i = 0; i < readableError.content.length; i++) {
      message += `-\t${readableError.content[i].context} in file ${readableError.content[i].file} at line: ${readableError.content[i].line}\n`;
    }
    console.error(message);
  }
}

module.exports = {Logger};
