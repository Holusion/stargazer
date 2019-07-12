'use strict'

module.exports = function createPopup(style) {
    const box_template = document.createElement('template');
    box_template.innerHTML = `
        <style>
        :host {
            position: fixed;
            z-index: 20;
            top: 0px;
            left: 0px;
            right: 0px;
            bottom: 0px;
            padding: 100px;
            background: rgba(0,0,0,0.6);
            visibility: hidden;
            transition: visibility 0s linear 0.2s, opacity 0.2s linear;
        }
        :host([visible='false']) {
            opacity: 0;
        }
        :host([visible='true']) {
            visibility: visible;
            opacity: 1;
            transition-delay: 0s;
        }
        .box {
            margin: auto;
            position: relative;
            background-color: rgba(256,256,256,1);
            height: 25%;
            max-width: 50%;
            padding: 8px;
            padding-bottom: 14px;
            top: calc(100vh / 4);
        }
        .box-content {
            position: relative;
            display: flex;
            align-items: center;
            text-align: center;
            flex-direction: column;
            justify-content: center;
            border-style: dashed;
            border-color: var(--mdc-theme-primary);
            height: 100%;
            padding: 0px;
            border-width: 3px;
            color:  var(--mdc-theme-secondary);
        }
        ${style}
        </style>
        <link rel="stylesheet" href="../node_modules/material-components-web/dist/material-components-web.css">
        <div class="box">
            <div class="box-content">
                <slot name="content"></slot>
            </div>
        </div>
    `
    return box_template.content;
}
