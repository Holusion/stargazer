'use strict';

const {dialog} = require('electron').remote;
const errorHandler = require("../errorHandler");
const {Notification} = require("../components/Notification");

class Notifier extends HTMLElement {
  constructor(){
    super();
  }
  removeNotification(elem) {
    elem.close().then(_ => {      
      this.removeChild(elem);
    })
  }
  removeNotificationIfNecessary() {
    if(this.childElementCount >= 3) {
      this.removeNotification(this.firstChild);
    }
  }
  pushError(err){
    this.removeNotificationIfNecessary();
    let elem = new Notification();
    this.appendChild(elem);

    const readableError = errorHandler.parseError(err);
    let message = "";
    for (var i = 0; i < readableError.content.length; i++) {
      message += `-\t${readableError.content[i].context} in file ${readableError.content[i].file} at line: ${readableError.content[i].line}\n`
    }

    elem.setContent(readableError.title, "Cliquez pour en savoir plus");
    setTimeout(() => {
      elem.enable = true;
    }, 100);

    elem.addEventListener('click', () => {
      dialog.showMessageBox({
        title: readableError.title,
        type: 'error',
        message: readableError.title,
        detail: message,
        buttons: ['OK']
      });
    })

    elem.addEventListener('closeNotif', () => {
      this.removeNotification(elem);
    })
  }

  pushUpdate(arg) {
    this.removeNotificationIfNecessary();
    let elem = new Notification();
    this.appendChild(elem);

    elem.setContent(`Nouvelle mise à jour : ${arg.tag_name}`, "Cliquez pour télécharger la mise à jour", "refresh");
    setTimeout(() => {
      elem.enable = true;
    }, 100);

    elem.addEventListener('click', () => {
      let shell = require('electron').shell;
      shell.openExternal(arg.html_url);
      // this.removeNotification(elem);
    })

    elem.addEventListener('closeNotif', () => {
      console.log("test");
      
      this.removeNotification(elem);
    })
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
