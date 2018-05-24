'use strict';
const path = require('path');
const url = require('url');
const {EventEmitter} = require("events");
const {ipcMain, app, BrowserWindow, shell, Menu} = require('electron');
const {download} = require('electron-dl');

const pkgInfos = require("./package.json");


var mdns = require('mdns');


var resolve_sequence = [
  mdns.rst.DNSServiceResolve()
, mdns.rst.getaddrinfo({families:[0]})
, mdns.rst.makeAddressesUnique()
];
// watch all http servers
class ServiceSet extends EventEmitter{
  constructor(){
    super();
    this._data = [];
    let browser = mdns.createBrowser(mdns.tcp('workstation'),{resolverSequence:resolve_sequence});
    browser.on("error",function(e){
      switch(e.code){
        //uv_getaddrinfo() error codes are defined under UV__EAI_* in :
        //https://github.com/libuv/libuv/blob/fe3fbd63e5dfe26c473cdd422ad216a14ae2d7e4/include/uv-errno.h
        case -3008: //UV__EAI_NONAME
          //The node or service is not known; or both node and service are NULL;
          //or AI_NUMERICSERV was specified in hints.ai_flags
          //and service was not a numeric port-number string.
          // in `node_modules/mdns/lib/resolver_sequence_tasks.js :117` :
          // we call to cares_wrap's getAddrInfo which is :
          // https://github.com/nodejs/node/blob/master/src/cares_wrap.cc#L1891
          console.warn("name or service not known (no valid address found for device)");
          break
        default:
          throw new Error("network exploration error : "+e.message);
      }

    });
    browser.on('serviceUp',this.add.bind(this));
    browser.on('serviceDown', this.remove.bind(this));
    browser.start();
    this.browser = browser;
  }
  findIndex(item){
    return this._data.findIndex(n => typeof n.fullname ==="string" && n.fullname === item.fullname);
  }
  add(item){
    if(!item || !item.fullname) return console.warn("tried to add invalid item : ",item);
    let idx = this.findIndex(item);
    if( idx == -1){
      this._data.push(item);
      console.log("added Product : ",item);
    }else if(JSON.stringify(this._data[idx]) != JSON.stringify(item)){//update object if necessary
      this._data[idx] = item;
      console.log("updated Product : ",item);
    }else{
      return;
    }
    this.emit("change", this._data);
  }
  remove(item){
    if(!item || !item.fullname) return console.warn("tried to remove invalid item : ",item);
    let idx = this.findIndex(item);
    if (idx == -1) return console.warn("Tried to remove non-existant service : ",item);
    this._data.splice(idx, 1);
    this.emit("change", this._data);
  }
  get list(){
    return this._data;
  }
}


let services = new ServiceSet();


let mainWindow;

//Passive update publishing
services.on("change",function(list){
  if (!mainWindow || ! mainWindow.webContents){return}
  console.log("Change : ",JSON.stringify(list));
  mainWindow.webContents.send('clients-list', list);
})
//Active update requests
ipcMain.on('get-clients', (event) => {
  event.sender.send('clients-list', services.list);
});
//Active doawnload
ipcMain.on('download', (e, args) => {
  download(BrowserWindow.getFocusedWindow(), args.url)
    .then(dl => mainWindow.webContents.send("download-complete", dl.getSavePath()))
    .catch(console.error);
})

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width:1280,
    height: 1024,
    minWidth: 720,
    minHeight: 640,
    title: `${pkgInfos.name} - ${pkgInfos.version}`,
    webPreferences: {
      webSecurity: false
    }
  });

  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'lib', 'index.html'),
    protocol: 'file:',
    slashes: true
  }));
  if (process.env["NODE_ENV"] == "development"){
     mainWindow.webContents.openDevTools();
  }
  //

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

const template = [
  {
    label: 'Fichier',
    submenu: [
      { label: 'Accueil', click () {mainWindow.webContents.send('accueil')} },
      { label: 'Quitter', role: 'quit'}
    ]
  },
  {
    label: 'Fenêtre',
    submenu: [
      { label: 'Plein écran', role: 'togglefullscreen'},
      { label: 'Outil de développement', role: 'toggledevtools'}
    ]
  },
  {
    label: 'Aide',
    submenu: [
      { label: 'En savoir plus', click() {shell.openExternal('https://holusion.com')}},
      { label: 'Documentation', click() {shell.openExternal('https://github.com/Holusion/stargazer')}}
    ]
  }
]

const menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);


//*/
