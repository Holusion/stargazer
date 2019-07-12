'use strict'

module.exports = function createButton() {
    const button_template = document.createElement("template");
    button_template.innerHTML = `
        <style>
            button {
                margin-bottom: 16px;
            }
        </style>
        <link rel="stylesheet" href="../node_modules/material-components-web/dist/material-components-web.css">
        <button class="mdc-button mdc-button--raised">
            <slot name="label">Non définie</slot>
        </button>
    `
    return button_template.content;
}