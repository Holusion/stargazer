import "./App.css"
import {ButtonIcon, Spinner, Topbar} from "@holusion/react-components-holusion";
import {dispatchError, dispatchList, dispatchTask, endTask, listenError, listenInfo, listenTasks} from "./store";
import {getList, pushError, pushInfo, pushUpdater, removeNotification} from './api/notifier'
import Home from "./containers/Home";
import {Logger} from "./widgets/Logger";
import Notifier from "./components/Notifier";
import Product from "./containers/Product";
import ProductList from "./components/ProductList";
import React from 'react';
import Toolbar from "./components/Toolbar";
import {checkUpdate} from './updater';
import {ipcRenderer} from 'electron';
import url from 'url';

export default class App extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            updating: false,
            leftPanelHide: false,
            list: [],
            selection: [],
            url: null,
            title: "Holusion",
            tasksLength: 0,
            filterOpen: false,
            notifications: []
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
            pushError(evt.detail);
            logger.push(evt.detail);
            this.updateNotifications();
        });

        listenInfo((evt) => {
            pushInfo(evt.detail);
            this.updateNotifications();
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
                if(this.state.url != null && message.filter(elem => elem.name === this.state.url.name).length === 0) {
                    this.setState(() => ({url: null}));
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

        checkUpdate().then(info => {
            pushUpdater(info);
            this.updateNotifications();
        })
    }

    updateNotifications() {
        this.setState(() => ({notifications: getList()}))
        setTimeout(() => {
            this.setState(() => ({notifications: getList()}))
        }, 1000);
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

    getProductName() {
        fetch(url.resolve(`http://${this.state.url}`, `system/hostname`)).then(res => res.text()).then(txt => this.setState(() => ({title: txt})))
    }
    
    render() {
        let rightPanel = <Home />

        if(this.state.url) {
            rightPanel = <Product 
                            url={this.state.url}
                            onSelectionChange={(selected) => this.setState(() => ({selection: selected}))}
                            filterOpen={this.state.filterOpen}
                        />
            this.getProductName();
        }

        const toolbar = <Toolbar url={this.state.url} selection={this.state.selection} onTaskStart={dispatchTask} onTaskEnd={endTask} onFilterClick={() => this.setState(() => ({filterOpen: !this.state.filterOpen}))} />;
        let spinner = <Spinner active={this.state.tasksLength != 0} style={{position:"absolute",top:"50%", right:"50%", color:"var(--theme-primary)"}}/>

        return (
            <div className="container">
                {spinner}
                <Notifier list={this.state.notifications} onRemove={(item) => {
                    removeNotification(item, 1000);
                    this.updateNotifications();
                }} />
                <Topbar title={this.state.title} start={this.createStartTopAppBar()} end={this.state.url ? toolbar : null} />
                <div className="contents">
                    <ProductList onButtonClick={this.updateProductList.bind(this)} onProductSelected={(productUrl) => this.setState(() => ({url: productUrl}))} hide={this.state.leftPanelHide} list={this.state.list} />
                    <div className="right-content">
                        {rightPanel}
                    </div>
                </div>
            </div>
        )
    }
}