'use strict';
const Navigo = require("navigo");
var router = new Navigo("/", true);

const {Product} = require("./Product");
const Home = require("./Home");
function createRouter(target){
  function setContent(content) {
    while(target.firstChild) {
      target.removeChild(target.firstChild);
    }
    target.appendChild(content, target.firstChild);
  }
  router
    .on({
      'products/:id': function (params) {
        let p = new Product();
        p.id = params.id;
        setContent(p);
      },

      '*': function () {
        setContent(new Home());
      }
    })
    .resolve();
  return router;
}

function navigate(...args){
  return router.navigate(...args);
}

function currentHash() {
  return decodeURIComponent(window.location.hash.slice(1));
}

module.exports = {createRouter, navigate, currentHash};
