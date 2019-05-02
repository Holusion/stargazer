'use strict';

const {remote} = require('electron');
const {Menu, MenuItem} = remote

const Icon = require("../Icon");
const card = require("../templates/card");

class PlaylistItem extends HTMLElement {
  static get observedAttributes(){return ["name","image","active","rank","url",'selected','current','visible','hidden','start','removeitem']}
  set image(val) {this.setAttribute('image', val)}
  get image() {return this.getAttribute('image')}
  set url(val) {this.setAttribute('url', val)}
  get url() {return this.getAttribute('url')}
  set selected(val) {this.setAttribute('selected', '')}
  get selected() {return this.getAttribute('selected')};
  set current(val) {this.setAttribute('current', val)}
  get current() {return this.getAttribute('current') == 'true'};
  get active() {return this.getAttribute('active') == 'true'};
  set active(val) {return this.setAttribute('active', val)}
  get start() {return this.getAttribute('start') == 'true'}
  set start(val) {this.setAttribute('start', val)}
  get visible() {return this.getAttribute('visible')}
  set visible(val) {this.setAttribute('visible', val)}
  get removeitem() {return this.getAttribute('removeitem')}
  set removeitem(val) {this.setAttribute('removeitem', val)}
  constructor(){
    super();
    let dom = this.attachShadow({mode: 'open'});
    dom.appendChild(card());
    dom.querySelector("#basic-switch").addEventListener("click",(ev) => {
      this.toggleActive();
      ev.stopPropagation();
    });
    // this.visible = true;

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

    this.addEventListener('click', e => {
      let selected = document.querySelector('[selected]');
      if(selected && selected != this) selected.removeAttribute('selected');
      if(this.hasAttribute('selected')) {
        this.play();
      }
      this.selected = true;
    })

    let selector = this.shadowRoot.querySelector("#selector");
    selector.addEventListener('click', e => {
      if(selector.checked) {
        this.selected = true;
      } else {
        this.removeAttribute('selected');
      }
      e.stopPropagation();
    })
  }
  attributeChangedCallback(name, oldValue, newValue){
    this.shadowRoot.querySelector("#selector").checked = this.hasAttribute('selected');
    document.dispatchEvent(new CustomEvent('cardchange', {detail: {elem: this, action: name, oldValue: oldValue, value: newValue}}))
  }
  render(){
    while(this.firstChild) {
      this.removeChild(this.firstChild);
    }

    let dom = this.shadowRoot;
    let img = new Image();

    dom.querySelector(".card").style.backgroundImage = `url(../static/img/16-9.jpg)`;
    img.onload = () => {
      dom.querySelector(".card").style.backgroundImage = `url(http://${this.getAttribute('url')}${this.getAttribute("image")}?thumb=true)`;
    }
    img.src = `http://${this.getAttribute('url')}${this.getAttribute("image")}?thumb=true`;

    // Switch Actif / Inactif
    this.shadowRoot.querySelector("#basic-switch").checked = this.active;

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
  play() {
    if(this.active) {
      this.start = 'true';
    }
  }
  remove() {
    this.removeitem = true;
  }
  toggleActive() {
    this.active = !this.active;
    this.render();
  }
}

module.exports = {PlaylistItem};
