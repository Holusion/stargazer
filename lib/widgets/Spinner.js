'use strict';

class Spinner extends HTMLElement {
  constructor(){
    super();
    var shadow = this.attachShadow({mode: 'open'});
    this.div = document.createElement('div');
    this.div.className = "spinner";
    var style = document.createElement('style');
    style.textContent = `
    :host{
      z-index: 100;
    }
    :host([absolute])>div{
      position: fixed;
      top: 120px;
      left: 50%;
    }
    :host > span {
      display:none;
    }
    :host([absolute][active])> span{
      display:block;
      position:fixed;
      background: rgba(0,0,0,0.4);
      top:0;
      left:0;
      right:0;
      bottom:0;
    }
    :host > div{
      width: 0;
      height: 0;
      margin-left:0px;
      border-radius: 0px;
      box-sizing: border-box;
      border: 0px solid rgba(255, 255, 255, 0.2);
      border-top-color: #FFF;
      background-color:#103040;
      transition: all 0.5s ease-in-out;
    }
    :host([active]) > div{
      width: 40px;
      height: 40px;
      border-radius: 40px;
      margin-left:-20px;
      border-width: 5px;
      animation: spin 1s infinite linear;
    }
    @keyframes spin {
      100% {
        transform: rotate(360deg);
      }
    }
    `;
    shadow.appendChild(style);
    this.div.innerHTML = "<slot></slot>";
    shadow.appendChild(document.createElement("span"))
    shadow.appendChild(this.div);
  }

  static get observedAttributes() {return ['active', "absolute"]; }
  connectedCallback(){
  }

}

window.customElements.define("load-spinner", Spinner);

module.exports = {Spinner};
