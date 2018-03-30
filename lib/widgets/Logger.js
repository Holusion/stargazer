'use strict';

class Logger {
  constructor() {

  }

  parseError(err) {
    if(typeof err === 'object') {
      let str = "Error: ";
      for(var p in err) {
        if(err.hasOwnProperty(p)) {
          str += p + "::" + err[p] + '\n';
        }
      }
      str += "End Error";
      return str;
    }
    return err;
  }

  push(err) {
    const readableError = this.parseError(err);
    console.log(readableError);
  }
}

module.exports = new Logger();
