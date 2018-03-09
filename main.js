'use strict';
const path = require('path');
const url = require('url');

const {ipcMain, app, BrowserWindow} = require('electron');

const pkgInfos = require("./package.json");
const BonjourListener = require('./BonjourListener');

// Module to create native browser window.


const l = new BonjourListener();

let mainWindow;

//Passive update publishing
l.on("change",function(p){
  console.log("product list changed : ", p);
  if (!mainWindow || ! mainWindow.webContents){return}
  mainWindow.webContents.send('clients-list', p);
});
//Active update requests
ipcMain.on('get-clients', (event) => {
  event.sender.send('clients-list', l.list);
});

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width:1280,
    height: 1024,
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
//*/
