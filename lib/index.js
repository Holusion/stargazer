'use strict';
const bonjour = require("bonjour")();
require("./widgets/Spinner");
require("./widgets/Notifier");
require("./Products");
require("./Icon");
const {dispatchList, listenTasks, dispatchTask, endTask, listenError} = require("./store");
const {createRouter} = require("./router");
createRouter(document.querySelector("#main-content"));

let spinner = document.querySelector("load-spinner");
let notifier = document.querySelector("load-notifier");
let errors = [];

let browser = bonjour.find({type:"workstation"});
browser.on("up",function(e){
  console.log("Device is up :",e)
});


//Set up spinner and notifier
listenTasks((evt)=>{
  let tasks = evt.detail;
  //console.log("Tasks updated : ",tasks);
  if(tasks.length != 0){
    spinner.setAttribute("active", true);
  }else {
    spinner.removeAttribute("active");
  }
});

dispatchTask("Initialization");

//Set up error manager
listenError((evt)=>{
  notifier.push(evt.detail);
});

/**
 * Global Functions
 */
// Most of them are quite ugly but still practical

//This is a global and - though ugly - can be called from anywhere.
function updateProductList(){
  dispatchTask("Update");
  backgroundUpdate().then(()=>{
    endTask("Update");
  }).catch((e)=> endTask("Update", e));
}
let is_updating = false;
let update_promise;
async function backgroundUpdate(){
  if (!is_updating){
    is_updating = true;
    update_promise = new Promise((resolve, reject)=>{
      astilectron.sendMessage("list", function(message) {
          if (!message.ok){
            reject(new Error("Failed to get products list"))
          }else{
            dispatchList((Array.isArray(message.list))?message.list: []);
            resolve(message.list);
          }
          is_updating = false;
      });
    });
  }else{
    console.log("Update already in progress. Returning  current promise")
  }

  return await update_promise;
}

function goBack(){
  window.history.back();
}
/**
 * Various Init Bindings
 */
document.addEventListener('astilectron-ready', function() {
  // This event is a lie : astilecton is not yet ready to receive events (Windows only).
  setTimeout(function(){
    updateProductList()
    endTask("Initialization");
  },50);
  //We can enable auto-update but networking is a bit too britle right now
  //setInterval(backgroundUpdate,10000);

});

window.addEventListener("keyup",(e)=>{
  if(e.keyCode == 116){
    window.location.reload();
  }
})
