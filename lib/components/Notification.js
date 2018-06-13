const notification = require('../templates/notification');
const Icon = require('../Icon');

class Notification extends HTMLElement {

    static get observedAttributes() {return ['enable']}
    get enable() {return this.getAttribute('enable')}
    set enable(value) {this.setAttribute('enable', value)}

    constructor() {
        super();
        let dom = this.attachShadow({mode: 'open'});
        dom.appendChild(notification());
    }

    connectedCallback() {
        this.render();
    }

    render() {
        let dom = this.shadowRoot;

        let closeButton = Object.assign(document.createElement("button"), {
            slot: 'close-button',
            className: "close-button",
            title: `Ferme la notification courante`,
            style: "background-color: rgba(255,255,255,0); color: white; width: 16px; height: 16px; border-width: 0px; display: flex; flex-direction: column; align-items: center; justify-content: center;",
            // onclick: (evt) => {evt.stopPropagation(); this.remove()}
          }
        );
        closeButton.addEventListener('click', (evt) => {
            this.dispatchEvent(new CustomEvent('closeNotif'));
            evt.stopPropagation();
        })

        let icon = new Icon('close');
        icon.slot = 'button-icon';
        icon.classList.add("mdc-button__icon");
        icon.setAttribute('icon-style', "width:16; height:16");
        closeButton.appendChild(icon);
        this.appendChild(closeButton);
    }

    setContent(title, text, icon) {
        let titleContent = Object.assign(document.createElement('span'), {
            slot: 'title'
        })
        titleContent.textContent = title;
        this.appendChild(titleContent);

        let textContent = Object.assign(document.createElement('span'), {
            slot: 'content'
        })
        textContent.textContent = text;
        this.appendChild(textContent);
        if(icon) {
            let iconElement = new Icon(icon);
            iconElement.setAttribute("icon-style", "width:95;height:95");
            let iconContent = Object.assign(document.createElement('span'), {
                slot: 'icon'
            });
            iconContent.appendChild(iconElement);
            this.appendChild(iconContent);
        }
    }

    close() {
        return new Promise((resolve, reject) => {
            this.enable = false;
            let notif = this.shadowRoot.querySelector('.notification');
            notif.addEventListener('transitionend', () => {
                notif.style.height = 0;
                notif.addEventListener('transitionend', resolve)
            })
        })
    }
}

window.customElements.define("h-notification", Notification);
module.exports = {Notification}