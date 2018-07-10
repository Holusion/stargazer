'use strict';
/**
 * This whole module is organized around the concept of event emitter/listeners
 * Functions are grouped by usage, and generally along :
 * dispatcher - Emit a corespondign event
 * listener - Gets called on update
 * getter - Get current status (synchronously)
*/

//Global store variables
var list = [];
const tasks = new Set();

function getList(){
  return list;
}
/* List looks like an array of :
 { interfaceIndex: 2,
  type:
   ServiceType {
     name: 'workstation',
     protocol: 'tcp',
     subtypes: [],
     fullyQualified: true },
  replyDomain: 'local.',
  flags: 2,
  name: 'prism-34 [00:e0:2f:1e:e6:bc]',
  networkInterface: 'eth0',
  fullname: 'prism-34\\032\\09100\\058e0\\0582f\\0581e\\058e6\\058bc\\093._workstation._tcp.local.',
  host: 'prism-34.local.',
  port: 9,
  addresses: [ '192.168.1.119' ] }
*/
function dispatchList(newList){
  //First try to filter-out non-updates
  if (newList.length == list.length && JSON.stringify(newList) == JSON.stringify(list)){
    return; //No update is to be performed
  }
  list = newList;
  document.dispatchEvent(new CustomEvent("list",{detail:list}));
}

function listenList(fn){
  document.addEventListener("list",fn);
  return document.removeEventListener.bind(document,"list",fn);
}


function dispatchTask(uid){
  tasks.add(uid);
  //console.log("task dispatched : ",tasks)
  document.dispatchEvent(new CustomEvent("tasks",{detail:Array.from(tasks)}));
  return endTask.bind(null,uid);
}

function endTask(uid, err){
  if (err){
    document.dispatchEvent(new CustomEvent("internalError",{detail:err}));
  }
  tasks.delete(uid);
  document.dispatchEvent(new CustomEvent("tasks",{detail:Array.from(tasks)}));
}

function listenTasks(fn){
  document.addEventListener("tasks",fn);
  return document.removeEventListener.bind(document,"tasks",fn);
}

function getTasks(){
  return Array.from(tasks);
}

function listenError(fn){
  document.addEventListener("internalError",fn);
  return document.removeEventListener.bind(document,"internalError",fn);
}

function dispatchInfo(title, message) {
  document.dispatchEvent(new CustomEvent("info", {detail: {title: title, message: message}}))
}

function listenInfo(fn) {
  document.addEventListener('info', fn);
  return document.removeEventListener.bind(document, 'info', fn);
}

function dispatchPlaylist(event, data) {
  document.dispatchEvent(new CustomEvent(event, {detail: data}));
}

function listenPlaylist(event, fn) {
  document.addEventListener(event, fn);
  return document.removeEventListener.bind(document, event, fn);
}

module.exports = {
  dispatchList,
  listenList,
  getList,
  dispatchTask,
  endTask,
  listenTasks,
  getTasks,
  listenError,
  dispatchInfo,
  listenInfo,
  dispatchPlaylist,
  listenPlaylist
};
