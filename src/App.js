import "./App.css"
import Home from "./containers/Home";
import React from 'react';
import Topbar from './components/Topbar';

export default class App extends React.Component {
    render() {
        return (
            <div className="container">
                <Topbar title="Holusion"/>
                <div className="contents">
                    <div className="left-content">

                    </div>
                    <div className="right-content">
                        <Home />
                    </div>
                </div>
            </div>
        )
    }
}