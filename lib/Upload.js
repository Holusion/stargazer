'use strict';

const Icon = require("./Icon");
const fs = require('fs');
const http = require('http');
const {dispatchTask, endTask} = require("./store");
const FormData = require("form-data");

const {HTTPError} = require('./errors/HTTPError');


class Upload extends HTMLElement{
  static get observedAttributes() {return ['loading', "url"]; }
  constructor(template){
    super();
    this.onclick = (e)=>{
      var inputElement = document.createElement("input");
      inputElement.type = "file";
      inputElement.multiple = "multiple"
      // Set accept to the file types you want the user to select.
      //inputElement.accept = accept;
      inputElement.onclick = (e) => {
        inputElement.value = null;
      }
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

  async sendFile(url, file) {
    const form = new FormData();
    form.on('error', (err) => {
      console.log(err);
    })
    form.append('file', fs.createReadStream(file.path));
    let options = {
      host: url,
      port: 3000,
      path: '/medias',
      method: 'POST',
      headers: form.getHeaders()
    }
    return await new Promise((resolve, reject) => {

      let req = http.request(options);
      form.pipe(req);
      req.on('response', (res) => {
        if(res.statusCode === 200) {
          resolve(res.statusMessage);
        } else {
          reject(new HTTPError(`UPLOAD: ${file.path} - ${res.statusCode} - ${res.statusMessage}`, `le fichier existe déjà, veuillez supprimer le médias ${file.name} avant de réessayer`))
        }
      });
      req.on('error', (e) => {
        reject(e)
      });
    })
  }

  async upload(files){
    let res;
    console.log("files : ",files);
    let taskName = "Uploading"
    dispatchTask(taskName);
    for(let f of files) {
      let url = this.getAttribute('url');
      try{
        res = await this.sendFile(url, f)
        endTask(taskName);
      }catch(err){
        endTask(taskName, err);
      }
      //Emit a change event even if it failed
    }
    this.dispatchEvent(new Event("change"));
    return res
  }

}
window.customElements.define("h-upload", Upload);
module.exports = Upload;
