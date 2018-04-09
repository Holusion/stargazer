'use strict';
'use strict';

const {dialog} = require('electron').remote;
const errorHandler = require("../errorHandler");

class Notifier extends HTMLElement {
  constructor(){
    super();
    var shadow = this.attachShadow({mode: 'open'});
    this.div = document.createElement('div');
    this.div.className = "spinner";
    var style = document.createElement('style');
    style.textContent = `
    :host{
      z-index: 101;
      display:none;
    }
    :host([active]){
      display:block;
    }
    :host > .count{
      width: 40px;
      height: 40px;
      border-radius: 40px;
      margin-left:-20px;
      box-sizing: border-box;
      border: 5px solid #103040;
      display: flex;
      align-items: center;
      justify-content: center;
      color: red;
      font-weight:bold;
    }
    :host([active]) > .count{
      animation: spin 0.5s 5 alternate ease-in-out;
    }
    @keyframes spin {
      100% {
        transform: scale(1.05);
      }
    }
    :host > .lines{
      display:none;
      max-width:200px;
    }
    :host([active][show]) > .lines{
      display:block;
      position: absolute;
      padding:5px;
      border:1px solid #ccc;
      top:50px;
      right:10px;
      background: #ddd;
    }

    `;
    shadow.appendChild(style);
    this.div.innerHTML = "0";
    this.div.className="count";
    let span = document.createElement("span");
    span.className = "lines";
    span.innerHTML = "<slot></slot>"
    shadow.appendChild(span);
    shadow.appendChild(this.div);
  }
  push(err){
    let elem = document.createElement('span');
    Object.assign(elem.style, {whiteSpace: "nowrap", display:"block"})
    elem.textContent = `${new Date().toLocaleTimeString("fr-FR")} ${err}`
    this.appendChild(elem);
    this.div.innerHTML = this.children.length.toString();
    this.setAttribute("active", true);

    const readableError = errorHandler.parseError(err);
    let message = "";
    for (var i = 0; i < readableError.content.length; i++) {
      message += `-\t${readableError.content[i].context} in file ${readableError.content[i].file} at line: ${readableError.content[i].line}\n`
    }
    dialog.showMessageBox({
      title: readableError.title,
      type: 'error',
      message: readableError.title,
      detail: message,
      buttons: ['OK']
    });
  }
  connectedCallback(){
    this.onclick = (e)=>{
      if (this.getAttribute("show")){
        this.removeAttribute("show");
      } else{
        this.setAttribute("show", true);
      }
    }
  }
}

window.customElements.define("load-notifier", Notifier);

module.exports = {Notifier};
