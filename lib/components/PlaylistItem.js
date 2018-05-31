const {ipcRenderer, remote} = require('electron');
const {Menu, MenuItem} = remote

const {getList, listenList, dispatchTask, endTask} = require("../store");
const Icon = require("../Icon");
const card = require("../templates/card");

class PlaylistItem extends HTMLElement {
  static get observedAttributes(){return ["name","image","active","rank","url",'selected','current','hidden', 'start']}
  set image(val) {this.setAttribute('image', val)}
  get image() {return this.getAttribute('image')}
  set selected(val) {this.setAttribute('selected', val)}
  get selected() {return this.getAttribute('selected')};
  set current(val) {this.setAttribute('current', val)}
  get current() {return this.getAttribute('current') == 'true'};
  get active() {return this.getAttribute('active') == 'true'};
  set active(val) {return this.setAttribute('active', val)}
  get start() {return this.getAttribute('start') == 'true'}
  set start(val) {this.setAttribute('start', val)}
  constructor(){
    super();
    let dom = this.attachShadow({mode: 'open'});
    dom.appendChild(card());
    dom.querySelector("#basic-switch").addEventListener("click",(ev) => {
      this.toggleActive();
      ev.stopPropagation();
    });
    this.addEventListener("change", (e) => {
      console.log(e);
    })

    const self = this;
    const menu = new Menu();
    menu.append(new MenuItem({label: "Jouer", click() {self.play()}}));
    menu.append(new MenuItem({label: "Activer/Desactiver", click() {self.toggleActive()}}))
    menu.append(new MenuItem({label: "Supprimer", click() {self.remove()}}))

    this.addEventListener("contextmenu", (e) => {
      menu.popup({window: remote.getCurrentWindow()})
    }, false);
  }
  connectedCallback(){
    this.render();
  }
  attributeChangedCallback(name, oldValue, newValue){
    document.dispatchEvent(new CustomEvent('cardchange', {detail: {elem: this, action: name, oldValue: oldValue, value: newValue}}))
  }
  render(){
    while(this.firstChild) {
      this.removeChild(this.firstChild);
    }

    let img = `http://localhost:3001/image${this.getAttribute("image")}`;
    let dom = this.shadowRoot;
    // console.log("image url : ",(img)?img:p("public","img","1-1.jpg"));
    dom.querySelector(".card").style.backgroundImage = (img)? `url(${img})`: `url(../static/img/1-1.jpg)`;

    // Switch Actif / Inactif
    this.shadowRoot.querySelector("#basic-switch").checked = this.active;

    if(this.current) {
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

    this.appendChild(Object.assign(document.createElement("span"),{
      slot: "name",
      textContent: this.name.split('.')[0]
    }));

    // Delete button;
    let rightButton = Object.assign(document.createElement("button"), {
        slot: 'right-action',
        className: "right-button",
        title: `supprimer définitivement ce média`,
        style: "background-color: darkred; color: white; border-color: darkred; width: 30px; height: 30px; border-radius: 2px;",
        onclick: (evt) => {evt.stopPropagation(); this.remove()}
      }
    );
    let icon = new Icon("delete");
    icon.setAttribute('icon-style', "width:16;height:16")
    rightButton.appendChild(icon);
    this.appendChild(rightButton);

    let mainButton = Object.assign(document.createElement("button"), {
        slot: 'main-action',
        className: "main-button mdc-button",
        style: "color: white; height: 26px; margin: 0px; min-width:26px; padding: 0px; padding-right: 8px;",
        title: `lance directement ce média`,
        onclick: this.play.bind(this)
      }
    );
    let playIcon = new Icon("play");
    icon.setAttribute("icon-style", "width:16;height:16");
    if(this.active) mainButton.appendChild(playIcon);
    this.appendChild(mainButton);
  }
  select() {
    this.selected = 'true';
    this.shadowRoot.querySelector("#selector").checked = true;
  }
  unselect() {
    this.selected = 'false';
    this.removeAttribute('selected');
    this.shadowRoot.querySelector("#selector").checked = false;
  }
  play() {
    if(this.active) {
      this.start = 'true';
    }
  }
  remove() {
    this.hidden = 'true';
  }
  toggleActive() {
    this.active = !this.active
  }
}

module.exports = {PlaylistItem};
