'use strict';
const NativeListener = require('../build/Release/BonjourListener').BonjourListener;
const {EventEmitter} = require("events");
class BonjourListener extends EventEmitter{
  constructor(){
    super();
    this._list = new Set();
    this.browser = new NativeListener(this.onchange.bind(this));
  }
  get list(){
    return Array.from(this._list);
  }
  onchange(str){
    let changes = str.split("\n").filter(n => n);
    changes.forEach((line)=>{
      let [action, ...name] = line.split(" ");
      switch (action){
        case 'add':
          this._list.add(name.join(" "));
          break;
        case 'rm':
          this._list.delete(name.join(" "));
          break;
        default:
          console.warn("unknown Zeroconf action : %s", line);
      }
    });
    if (0 < changes.length){
      this.emit("change", this.list);
    }
  }
}

module.exports = BonjourListener;
