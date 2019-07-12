'use strict';

const card = require("../templates/card");

const Upload = require("../Upload");
const Icon = require("../Icon");

class UploadCard extends Upload {
  constructor() {
    super(card(`
      .playlist-card{
        background-color:#2fafe6;
        display:flex;
        alignItems:center;
        justifyContent:center;
      }
      .card__title{
        background-color: rgba(0,0,0,0);
      }
      .card__actions{
        display: none;
      }
      .state{
        display:block;
      }
      `))
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.classList.add("uploaderCard");
    this.setAttribute("url", this.url);

    const title = document.createElement("span");
    title.textContent = "Envoyer une vidéo";
    title.setAttribute("slot", "name");
    const uploadIcon = new Icon("upload");
    uploadIcon.setAttribute('icon-style', "width:100;height:100");
    uploadIcon.setAttribute("slot","state");
    
    this.appendChild(uploadIcon);
    this.appendChild(title);
  }
}

window.customElements.define('h-uploadcard', UploadCard);
module.exports = {UploadCard};
