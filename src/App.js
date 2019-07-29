import "./App.css"
import {Button, ButtonIcon, List, ListItem, Spinner, Topbar} from "@holusion/react-components-holusion";
import {dispatchError, dispatchList, dispatchTask, listenError, listenInfo, listenTasks} from "./store";
import Home from "./containers/Home";
import {Logger} from "./widgets/Logger";
import Product from "./containers/Product";
import React from 'react';
import Toolbar from "./components/Toolbar";
import {ipcRenderer} from 'electron';


export default class App extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            updating: false,
            leftPanelHide: false,
            list: [],
            product: null,
            selectionLength: 0,
            tasksLength: 0,
        }

    }
    
    componentDidMount() {
        listenTasks((evt)=>{
            const tasks = evt.detail;
            this.setState(() => ({tasksLength: tasks.length}))
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
                setTimeout(() => {
                    typeof this.state.updating == "function" && this.state.updating();
                    this.setState(() => ({updating: false}))
                }, 400);
            }
            if (Array.isArray(message)){
            // console.log("new list : ",message)
                dispatchList(message);
                this.setState(() => ({list: message}))
                if(this.state.product != null && message.filter(elem => elem.name === this.state.product.name).length === 0) {
                    this.setState(() => ({product: null}));
                }
            }else{
                dispatchError(new Error("clients-list is not an array : "+ JSON.stringify(message)));
            }
        });

        ipcRenderer.on('accueil', () => {
            this.setState(() => ({product: null}));
        })

        ipcRenderer.on('remote-error', (sender, errors) => {
            for(let error of errors) {
                dispatchError(error);
            }
        })
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

    navigateToProduct(message) {
        this.setState(() => ({product: message}))
    }
    
    render() {
        const items = this.state.list.map(msg => <ListItem key={msg.name} icon="library" onClick={this.navigateToProduct.bind(this, msg)}>{msg.name}</ListItem>)

        const leftPanel = (
            <div className={`left-content ${this.state.leftPanelHide ? "hide" : ""}`}>
                <div className="list-group">
                    <Button onClick={this.updateProductList.bind(this)}>Actualiser</Button>
                    <List>
                        {items}
                    </List>
                </div>
            </div>
        )

        let rightPanel = <Home />
        let title = "Holusion"

        if(this.state.product) {
            rightPanel = <Product key={this.state.product.name} product={this.state.product} onSelectionChange={(selected) => this.setState(() => ({selectionLength: selected.length}))} />
            title = this.state.product.name;
        }

        const toolbar = <Toolbar selectionLength={this.state.selectionLength} />;
        let spinner = <Spinner absolute />
        if(this.state.tasksLength != 0) {
            spinner = <Spinner active absolute />
        }

        return (
            <div className="container">
                {spinner}        
                <Topbar title={title} start={this.createStartTopAppBar()} end={this.state.product ? toolbar : null}/>
                <div className="contents">
                    {leftPanel}
                    <div className="right-content">
                        {rightPanel}
                    </div>
                </div>
            </div>
        )
    }
}