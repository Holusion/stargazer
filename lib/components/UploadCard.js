const card = require("../templates/card");

const Upload = require("../Upload");
const Icon = require("../Icon");

class UploadCard extends Upload {
  constructor() {
    super(card(`
      .playlist-card{
        background-color:#103040;
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
      `))
  }

  connectedCallback() {
    this.render();
  }

  render() {
    let uploader = new Upload();
    this.classList.add("uploaderCard");
    this.setAttribute("url", this.url);
    let uploadIcon = new Icon("upload");
    uploadIcon.setAttribute('icon-style', "width:48;height:48");
    uploadIcon.setAttribute("slot","name");
    this.appendChild(uploadIcon);
  }
}

window.customElements.define('h-uploadcard', UploadCard);
module.exports = {UploadCard};
