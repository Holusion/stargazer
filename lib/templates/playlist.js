'use strict'

module.exports = function createPlaylist() {
  const playlist_template = document.createElement("template");
  playlist_template.innerHTML = `
  <style>
  #items {
    display:flex;
    flex-wrap:wrap;
    padding-left: 16px;
    padding-right: 16px;
    position: relative;
  }
  </style>
  <div id="items">
    <slot name='items'></slot>
  </div>
  `
  return playlist_template.content
}
