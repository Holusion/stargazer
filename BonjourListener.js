'use strict';
const {NativeListener} = require('./build/Release/BonjourListener').BonjourListener;
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
    let changes = str.split("\n")
    changes.forEach(function(line){
      let [action, name] = line.split(" ");
      switch (action){
        case 'add':
          this._list.add(name);
          break;
        case 'rm':
          this._list.delete(name);
          break;
        default:
          console.warn("unknown Zeroconf action : %s", action);
      }
    });
    if (0 < changes.length){
      this.emit("change", this.list);
    }
  }
}
