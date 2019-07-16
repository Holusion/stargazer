'use strict';
const path = require('path');
const basedir = path.resolve(__dirname,"..");

export default function p(...file){
  return path.resolve(basedir, ...file);
}