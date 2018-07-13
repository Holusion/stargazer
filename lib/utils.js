'use strict';
const http = require("http");
const app = require('express')();
const p = require('./resolver');

let imageOption;

app.listen(3001);
app.get('/image/*', async (req, res) => {
  let image = req.params[0];
  imageOption.path = `/${image}?thumb=true`
  let obj = await fetch(imageOption);
  res.contentType('png');
  res.end(obj, 'binary');
});

function imageCall(url) {
  imageOption = {
    port: 3000,
    host: url
  }
}

function fetch(options) {
  let obj = "";
  return new Promise((resolve, reject) => {
    let req = http.get(options)
    req.on('response', (res) => {
      res.setEncoding('binary');
      res.on('data', (chunk) => {
        obj += chunk;
      })
    })
    req.on('error', (error) => {
      reject(error);
    })
    req.on('close', () => {
      resolve(obj);
    });
  })
}

function request(options, data) {
  let obj = "";
  return new Promise((resolve, reject) => {
    let req = http.request(options)
    req.on('response', (res) => {
      obj = res;
    })
    req.on('error', (error) => {
      reject(error);
    })
    req.on('close', () => {
      resolve(obj);
    });
    if(data) {
      req.setHeader('Content-Type', 'application/json')
      if(data) req.write(data);
    }
    req.end();
  })
}

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
  imageCall,
  fetch,
  request,
  makeIcon
}
