/* eslint-disable react/no-unescaped-entities */
'use strict';
import "./Home.css"
import React from 'react';

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    let shell = require('electron').shell
    document.addEventListener('click', function (event) {
      if (event.target.tagName === 'A' && event.target.href.startsWith('http')) {
        event.preventDefault()
        shell.openExternal(event.target.href)
      }
    })
  }

  render() {
    return (
      <div className="home-content">
        <h1 style={{textAlign:"center", color:"var(--theme-secondary)"}}>Bienvenue</h1>
        <div className="home-connect">
          <img className="home-connect-img" src={"static/img/connect.svg#connect"} />
        </div>
        <p> Utilisez la liste dans la colonne de gauche pour sélectionner le produit à utiliser</p>
        <p> Si la liste est vide, vérifiez que votre produit est correctement connecté au réseau et actualisez</p>
        <p> Le produit est détecté lorsqu'il apparaît dans le menu à gauche de cette fenêtre. Sélectionnez le produit pour l'utiliser</p>
        <p> Pour toute aide, visitez</p>
        <ul>
          <li>La <a className="home-link" href="https://github.com/Holusion/stargazer">documentation de Stargazer</a> pour le guide d'utilisation</li>
          <li>Le site <a className="home-link" href="http://holusion.com">Holusion.com</a> pour nous contacter</li>
          <li>Le <a className="home-link" href="https://github.com/Holusion/stargazer/issues">bugtracker</a> pour nous remonter un bug</li>
        </ul>
      </div>
    )
  }
}