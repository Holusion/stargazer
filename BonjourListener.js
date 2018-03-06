'use strict';
const {BonjourListener} = require('./build/Release/BonjourListener');

console.log(BonjourListener);
const browser = new BonjourListener(function(e){
  console.log("callback called : ", e);
});
//browser.emit();
