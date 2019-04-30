'use strict';
const http = require("http");
const p = require('./resolver');

function makeIcon(name){
  let n = getNode("svg", {fill:"#fff", width: 24, height: 24, viewBox:"0 0 24 24"});
  let u = getNode('use',{})
  u.setAttributeNS('http://www.w3.org/1999/xlink', 'href', `${p("static/icons/combined.svg#icon-"+name
)}`);
  n.appendChild(u);
  return n;
}

//Helper function to create svg partials
function getNode(n, v) {
  n = document.createElementNS("http://www.w3.org/2000/svg", n);
  for (var p in v){
    n.setAttributeNS(null, p, v[p]);
  }
  return n;
}

module.exports = {
  makeIcon
}
