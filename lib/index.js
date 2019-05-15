'use strict';
require("./widgets/Spinner");
require("./widgets/Notifier");
require("./Products");
require("./Icon");

const {ipcRenderer} = require('electron');

const {dispatchList, listenTasks, dispatchTask, listenError, listenInfo, dispatchError} = require("./store");
const {createRouter} = require("./router");
const {Updater} = require("./updater");
const {Logger} = require("./widgets/Logger");
createRouter(document.querySelector("#main-content"));

let spinner = document.querySelector("load-spinner");
let notifier = document.querySelector("load-notifier");

//Set up spinner and notifier
listenTasks((evt)=>{
  let tasks = evt.detail;
  //console.log("Tasks updated : ",tasks);
  if(tasks.length != 0){
    spinner.setAttribute("active", true);
    spinner.setAttribute("title",tasks.join(", "));
  }else {
    spinner.removeAttribute("active");
  }
});

let updating;
let initializing = dispatchTask("Initialization");
let logger = new Logger();

//Set up error manager
listenError((evt)=>{
  notifier.pushError(evt.detail);
  logger.push(evt.detail);
});

listenInfo((evt) => {
  // console.log(evt);
  
  notifier.pushInfo(evt.detail);
})

/**
 * Global Functions
 */
// Most of them are quite ugly but still practical

//This is a global and - though ugly - can be called from anywhere.
function updateProductList(){
  if(!updating){
    updating = dispatchTask("Update");
    ipcRenderer.send('get-clients', {});
  }
}

/**
 * Various Init Bindings
 */
(function() {
  updateProductList();
  initializing();
  ipcRenderer.on("clients-list",function(evt, message){
    if (updating){
      setTimeout(function(){
        typeof updating == "function"  && updating();
        updating = false;
      }, 400);
    }
    if (Array.isArray(message)){
      // console.log("new list : ",message)
      dispatchList(message);
    }else{
      dispatchError(new Error("clients-list is not an array : "+ JSON.stringify(message)));
    }
  });

})();

window.addEventListener("keydown",(e)=>{
  if(e.keyCode == 116){
    window.location.reload();
  }
})

ipcRenderer.on('accueil', () => {
  document.location.href = 'index.html'
})

ipcRenderer.on('remote-error', (sender, errors) => {
  for(let error of errors) {
    dispatchError(error);
  }
})

let updater = new Updater();
updater.checkUpdate();
updater.once('update_found', (arg) => {
  notifier.pushUpdate(arg);
})