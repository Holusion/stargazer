'use strict';


module.exports = function createCard(style){
  const card_template= document.createElement("template");
  card_template.innerHTML = `
    <style>
    :host{
      transition: transform 0.2s ease-out;
    }
    :host([visible="false"]){
      transform: scale(0);
    }

    :host([selected]) .card__title{
      background-color: var(--mdc-theme-secondary);
    }
    .playlist-card{
      width:200px;
      height:200px;
      margin:1px;
      white-space: nowrap;
      background-color: rgba(0,0,0,0.4);
      background-size: 100%;
    }
    .card{
      display: flex;
      -webkit-box-orient: vertical;
      -webkit-box-direction: normal;
      box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12);
      flex-direction: column;
      -webkit-box-pack: end;
      justify-content: flex-end;
      box-sizing: border-box;
      padding: 0px;
      overflow: hidden;
      position: relative;
      user-select: none;
      border-radius: 4px;
    }
    .card:hover{
      cursor: pointer;
    }
    .card__primary{
      padding-top: 16px;
    }
    .card__title{
      color: white;
      margin: 0;
      padding: 16px;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      flex-direction: row;
      align-items: center;
    }
    .card__title__content{
      margin: 0;
      font-size: 16px;
      font-weight: 400;
      letter-spacing: normal;
      text-decoration: inherit;
      text-transform: inherit;
      text-overflow: ellipsis;
      overflow: hidden;
      position: relative;
      padding-right: 16px;
    }
    .card__actions{
      display: flex;
      position: absolute;
      top: 0;
      box-sizing: border-box;
      width: 200px;
    }
    .right-action{
      position: absolute;
      right: 0;
      color: white;
      vertical-align: middle;
      text-align: center;
    }
    .left-action{
      position: absolute;
      left: 8px;
      top: 8px;
      background-color: white;
      border-radius: 2px;
    }
    .middle-action{
      position: absolute;
      text-align: center;
      left: 85px;
      top: 8px;
    }
    .main-action{
      text-align: center;
      position: absolute;
      right: 0px;
    }
    .card__center{
      position: absolute;
      top: calc(50% - 50px);
      left: calc(50% - 50px);
      color: rgba(255,255,255,1);
      justify-content: center;
      vertical-align: middle;
      text-align: center;
    }
    .state {
      display: none;
    }
    :host([current]) .state {
      display: block
    }
    ${style}
    </style>
    <link rel="stylesheet" href="../node_modules/material-components-web/dist/material-components-web.css">
    <div class="card playlist-card">
      <section class="card__actions">
        <div class="left-action mdc-form-field">
          <div class="mdc-checkbox" style="padding: 0;">
            <input type="checkbox" class="mdc-checkbox__native-control" id="selector"/>
            <div class="mdc-checkbox__background" style="left: 0; top: 0; width:100%; height: 100%;">
                <svg class="mdc-checkbox__checkmark" viewBox="0 0 24 24">
                <path class="mdc-checkbox__checkmark-path"
                      fill="none"
                      stroke="white"
                      d="M1.73,12.91 8.1,19.28 22.79,4.59"/>
              </svg>
              <div class="mdc-checkbox__mixedmark"></div>
            </div>
          </div>
        </div>
        <div class="middle-action mdc-switch">
          <input type="checkbox" id="basic-switch" class="mdc-switch__native-control" title="activer / désactiver ce média">
          <div class="mdc-switch__background">
            <div class="mdc-switch__knob"></div>
          </div>
        </div>
        <div class="right-action">
          <slot name="right-action"></slot>
        </div>
      </section>
      <section class="card__primary">
        <div class="card__center">
          <span class="state">
            <h-icon name='play' icon-style='width:100;height:100'>
              <svg fill="currentColor" width="100" height="100" viewBox="0 0 24 24">
                <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="/home/yann/Documents/stargazer/static/icons/combined.svg#icon-play"></use>
              </svg>
            </h-icon>
          </span>
        </div>
        <div class="card__title">
          <h1 class="card__title__content">
            <slot name="name"></slot>
          </h1>
          <div class="main-action">
            <slot name="main-action"></slot>
          </div>
        </div>
      </section>
    </div>
  `
  return card_template.content;
}
