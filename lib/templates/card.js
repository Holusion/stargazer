'use strict';


module.exports = function createCard(style){
  const card_template= document.createElement("template");
  card_template.innerHTML = `
    <style>
    .playlist-card{
      width:200px;
      height:200px;
      margin:10px;
      white-space: nowrap;
      background-color: rgba(0,0,0,0.4);
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
      padding: 0;
      border-radius: 2px;
      overflow: hidden;
    }
    .card__primary{
      padding: 16px;
    }
    .card__title{
      color: white;
      font-size: 1.5rem;
      line-height: 2rem;
      font-weight: 400;
      letter-spacing: normal;
      text-decoration: inherit;
      text-transform: inherit;
      margin: 0;
    }
    .card__actions{
      display: flex;
      box-sizing: border-box;
      padding: 8px;
    }
    ${style}
    </style>
    <div class="card playlist-card">
      <section class="card__primary">
        <h1 class="card__title">
          <slot name="name"></slot>
        </h1>
      </section>
      <section class="card__actions">
        <slot name="actions"></slot>
      </section>
    </div>
  `
  return card_template.content;
}
