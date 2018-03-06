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

module.exports = {
  dispatchList,
  listenList,
  getList,
  dispatchTask,
  endTask,
  listenTasks,
  getTasks,
  listenError
};
