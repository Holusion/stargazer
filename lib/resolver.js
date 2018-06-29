'use strict';
const path = require('path');
const basedir = path.resolve(__dirname,"..");

function p(...file){
  return path.resolve(basedir, ...file);
}

module.exports = p;
