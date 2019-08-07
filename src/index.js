'use strict';
import './index.css';
import App from './App';
import React from "react";
import ReactDOM from 'react-dom';

window.addEventListener("keydown",(e)=>{
  if(e.keyCode == 116){
    window.location.reload();
  }
})

ReactDOM.render(<App />, document.getElementById('root'));