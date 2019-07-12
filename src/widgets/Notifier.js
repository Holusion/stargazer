'use strict';

const {dialog} = require('electron').remote;
const {Notification} = require("../components/Notification");

class Notifier extends HTMLElement {
  constructor(){
    super();
  }
  removeNotification(elem) {
    elem.close().then(() => {
      this.removeChild(elem);
    })
  }
  removeNotificationIfNecessary() {
    if(this.childElementCount >= 3) {
      for(let i = 0; i <= this.childElementCount - 3; i++) {
        this.removeNotification(this.childNodes[i]);
      }
    }
  }
  pushError(err){
    this.removeNotificationIfNecessary();
    let elem = new Notification();
    this.appendChild(elem);

    elem.setContent(err.name, "Cliquez pour en savoir plus");
    setTimeout(() => {
      elem.enable = true;
    }, 100);

    elem.addEventListener('click', () => {
      dialog.showMessageBox({
        title: err.name,
        type: 'error',
        message: err.message,
        detail: `Details:\n${err.stack}`,
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
      this.removeNotification(elem);
    })
  }

  pushInfo(info) {
    this.removeNotificationIfNecessary();
    let elem = new Notification();
    this.appendChild(elem);

    elem.setContent(info.title, info.message);
    setTimeout(() => {
      elem.enable = true;
    }, 100);

    elem.addEventListener('closeNotif', () => {
      this.removeNotification(elem);
    })
  }

  connectedCallback(){
    this.onclick = ()=>{
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
