'use strict';

module.exports = function createNotification(style) {
    const notification_template = document.createElement("template");
    notification_template.innerHTML = `
    <style>
    :host([enable='true']) .notification {
        transform: translate(-101%, 0);
    }
    :host(:hover) .notification-close, :host(:hover) .notification{
        opacity: 1;
    }
    .notification{
        width: 300px;
        height: 100px;
        background-color: var(--mdc-theme-primary);
        border-color: #1A4C66;
        border-width: 4px;
        border-style: solid;
        display: flex;
        flex-direction: row;
        color: white;
        font-size: 14px;
        transition: transform 0.3s ease-out, height 0.3s ease-out, opacity 0.3s ease-out;
        margin-top: 2px;
        cursor: pointer;
        opacity: 0.6;
        z-index: 999;
    }
    .notification-icon{
        background-color: #0D2633;
        height: 95px;
        widht: 95px;
        margin: 2px;
    }
    .right-panel{
        padding: 4px;
    }
    .notification-title{
        margin-bottom: 8px;
        font-weight: bold;
        word-break: break-word;
    }
    .notification-close{
        position: absolute;
        top: 0px;
        right: 0px;
        color: white;
        opacity: 0;
    }

    ${style}
    </style>
    <link rel="stylesheet" href="../node_modules/material-components-web/dist/material-components-web.css">
    <div class='notification'>
        <div class='left-panel'>
            <div class='notification-icon'>
                <slot name='icon'></slot>
            </div>
        </div>
        <div class='right-panel'>
            <div class='notification-title'>
                <slot name='title'></slot>
            </div>
            <div class='notification-content'>
                <slot name='content'></slot>
            </div>
            <div class='notification-close'>
                <slot name='close-button'></slot>
            </div>
        </div>
    </div>
    `;
    return notification_template.content;
}
