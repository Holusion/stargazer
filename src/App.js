import "./App.css"
import {dispatchError, dispatchList, dispatchTask, listenError, listenInfo, listenTasks} from "./store";
import Button from "./components/Button";
import ButtonIcon from "./components/ButtonIcon";
import Home from "./containers/Home";
import List from "./components/List/List";
import ListItem from "./components/ListItem";
import {Logger} from "./widgets/Logger";
import React from 'react';
import Topbar from './components/Topbar';
import {ipcRenderer} from 'electron';


export default class App extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            updating: false,
            leftPanelHide: false
        }
    }

    componentDidMount() {
        listenTasks((evt)=>{
            let tasks = evt.detail;
            //console.log("Tasks updated : ",tasks);
            if(tasks.length != 0){
                // spinner.setAttribute("active", true);
                // spinner.setAttribute("title",tasks.join(", "));
            }else {
                // spinner.removeAttribute("active");
            }
        });

        let initializing = dispatchTask("Initialization");
        let logger = new Logger();

        //Set up error manager
        listenError((evt)=>{
        //   notifier.pushError(evt.detail);
        logger.push(evt.detail);
        });

        listenInfo((evt) => {
        //   notifier.pushInfo(evt.detail);
        })

        this.updateProductList();
        initializing();
        ipcRenderer.on("clients-list",(evt, message) => {
            if (this.state.updating){
                setTimeout(function(){
                    typeof this.state.updating == "function" && this.state.updating();
                    this.setState(() => ({updating: false}))
                }, 400);
            }
            if (Array.isArray(message)){
            // console.log("new list : ",message)
                dispatchList(message);
            }else{
                dispatchError(new Error("clients-list is not an array : "+ JSON.stringify(message)));
            }
        });
    }

    updateProductList(){
        if(!this.state.updating){
            this.setState(() => ({updating: dispatchTask("Update")}))
            ipcRenderer.send('get-clients', {});
        }
    }

    createStartTopAppBar() {
        return <ButtonIcon name="menu" title="Cache la liste de produits" onClick={() => this.setState(() => ({leftPanelHide: !this.state.leftPanelHide}))}/>
    }
    
    render() {
        const items = ["Test","Test"];
        const leftPanel = this.state.leftPanelHide ? null : (
            <div className="left-content">
                <div className="list-group">
                    <Button onClick={this.updateProductList.bind(this)}>Actualiser</Button>
                    <List items={items} />
                </div>
            </div>
        )

        return (
            <div className="container">
                <Topbar title="Holusion" start={this.createStartTopAppBar()}/>
                <div className="contents">
                    {leftPanel}
                    <div className="right-content">
                        <Home />
                    </div>
                </div>
            </div>
        )
    }
}