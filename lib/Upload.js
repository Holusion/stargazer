'use strict';

const Icon = require("./Icon");
const fs = require('fs');
const {dispatchTask, endTask} = require("./store");

class Upload extends HTMLElement{
  static get observedAttributes() {return ['loading', "url"]; }
  constructor(template){
    super();
    this.onclick = (e)=>{
      var inputElement = document.createElement("input");
      inputElement.type = "file";
      // Set accept to the file types you want the user to select.
      //inputElement.accept = accept;
      inputElement.addEventListener("change", (evt)=>{
        console.log(evt);
        this.upload(evt.path[0].files);
      })
      // dispatch a click event to open the file dialog
      inputElement.dispatchEvent(new MouseEvent("click"));
    }
    this.ondrop = (e)=>{
      e.preventDefault();
      this.upload(e.dataTransfer.files);
      return false;
    }
    //Important to prevent default behaviour
    this.ondragover = () => {return false;};
    this.ondragleave = () => {return false;};
    this.ondragend = () => {return false;};
    if(template){ //dunno if it's a good idea...
      let dom = this.attachShadow({mode: 'open'});
      dom.appendChild(template);
    }

    Object.assign(this.style,{cursor:"pointer"});
  }

  async upload(files){
    let res;
    console.log("files : ",files);
    let taskName = "Uploading_"+files[0].name
    dispatchTask(taskName);
    const form = new FormData();
    form.append( 'file', files[0] );
    let url = this.getAttribute('url');
    try{
      res = await new Promise((resolve, reject)=>{
        var r = new XMLHttpRequest();
        r.open("POST", `${url}/medias`, true);
        r.addEventListener("load",function(e){
          if (this.readyState === XMLHttpRequest.DONE) {
            if (this.status === 200) {
              resolve(this.responseText);
            } else {
              reject({code: this.status, message:this.statusText});
            }
          }
        });
        r.addEventListener("error",reject);
        r.send(form);
      });
      endTask(taskName);
    }catch(e){
      endTask(taskName, e);
    }
    console.log(res);
    //Emit a change event even if it failed
    this.dispatchEvent(new Event("change"));
    return res
  }

}
window.customElements.define("h-upload", Upload);
module.exports = Upload;
