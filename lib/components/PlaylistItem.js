const {ipcRenderer, remote} = require('electron');

const {getList, listenList, dispatchTask, endTask} = require("../store");
const Icon = require("../Icon");
const card = require("../templates/card");

class PlaylistItem extends HTMLElement {
  get observedAttributes(){return ["name","image","active","rank", "url"]}
  set image(val) {this.setAttribute('image', val)}
  get image() {return this.getAttribute('image')}
  constructor(){
    super();
    let dom = this.attachShadow({mode: 'open'});
    dom.appendChild(card());
  }
  connectedCallback(){
    this.render();
  }
  attributeChangedCallback(){
    this.render();
  }
  render(){
    let img = `http://localhost:3001/image${this.getAttribute("image")}`;
    let dom = this.shadowRoot;
    console.log("image url : ",(img)?img:p("public","img","1-1.jpg"));
    dom.querySelector(".card").style.backgroundImage = (img)? `url(${img})`: `url(../static/img/1-1.jpg)`;
    if(this.classList.contains("is-selected")) {
      this.shadowRoot.querySelector(".card__title").style = "background-color: var(--mdc-theme-secondary);"
    } else {
      this.shadowRoot.querySelector(".card__title").style = "background-color: rgba(0, 0, 0, 0.5);"
    }

    if(this.classList.contains("current")) {
      if(!this.querySelector('.state')) {
        let playIcon = new Icon("play");
        playIcon.setAttribute("icon-style", "width:100;height:100");
        let state = Object.assign(document.createElement('span'), {
          slot: 'state',
          className: 'state'
        });
        state.appendChild(playIcon);
        this.appendChild(state);
      }
    } else {
      let stateChild = this.querySelector(".state");
      if(stateChild && stateChild.firstChild) {
        this.removeChild(stateChild);
      }
    }
  }
}

module.exports = {PlaylistItem};
