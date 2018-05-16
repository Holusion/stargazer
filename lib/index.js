'use strict';
require("./widgets/Spinner");
require("./widgets/Notifier");
require("./Products");
require("./Icon");

const {ipcRenderer} = require('electron');

const {dispatchList, listenTasks, dispatchTask, listenError} = require("./store");
const {createRouter} = require("./router");
const {Logger} = require("./widgets/Logger");
createRouter(document.querySelector("#main-content"));

let spinner = document.querySelector("load-spinner");
let notifier = document.querySelector("load-notifier");
let errors = [];



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
  notifier.push(evt.detail);
  logger.push(evt.detail);
});

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

function goBack(){
  window.history.back();
}
/**
 * Various Init Bindings
 */
(function() {
  updateProductList();
  initializing();
  ipcRenderer.on("clients-list",function(evt, message){
    if (updating){
      updating();
      updating = false;
    }
    if (Array.isArray(message)){
      console.log("new list : ",message)
      dispatchList(message);
    }else{
      notifier.push(new Error("clients-list is not an array : "+ JSON.stringify(message)));
    }
  });

})();

window.addEventListener("keyup",(e)=>{
  if(e.keyCode == 116){
    window.location.reload();
  }
})

ipcRenderer.on('accueil', (sender) => {
  document.location.href = 'index.html'
})
