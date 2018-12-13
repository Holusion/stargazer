'use strict';
const fs = require('fs');
const path = require('path');
const url = require('url');
const {EventEmitter} = require("events");
const electron = require('electron');
const {ipcMain, app, BrowserWindow, shell, Menu} = require('electron');
const {download} = require('electron-dl');

const pkgInfos = require("./package.json");
const constant = require('./constants');

const {Scanner} = require('@holusion/product-scanner')


let services = new Scanner();
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
    show: false,
    title: `${pkgInfos.name} - ${pkgInfos.version}`,
    webPreferences: {
      webSecurity: false
    }
  });

  let splash = new BrowserWindow({
    width: 640,
    height: 360,
    frame: false,
    alwaysOnTop: true,
    center: true,
    title: `${pkgInfos.name} - ${pkgInfos.version}`,
    webPreferences: {
      webSecurity: false
    },
  });
  splash.loadURL(url.format({
    pathname: path.join(__dirname, 'lib', 'splash.html'),
    protocol: 'file',
    slashes: true
  }));

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

  mainWindow.once('ready-to-show', () => {
    setTimeout(() => {
      splash.destroy();
      mainWindow.show();
    }, 1000);
  })

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

if(!fs.existsSync(constant.DATA_PATH)) {
  fs.mkdirSync(constant.DATA_PATH);
}

if(!fs.existsSync(constant.PLUGINS_PATH)) {
  fs.mkdirSync(constant.PLUGINS_PATH);
}

//*/
