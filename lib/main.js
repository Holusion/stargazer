
const path = require('path');
const { app, BrowserWindow, ipcMain } = require('electron')

let c = new AbortController();
let hosts = new Map();

require('./menu.js')

import("@holusion/product-scanner").then(async ({default: scanner})=>{
  for await (let host of scanner({signal: c.signal})){
    hosts.set(host.host, host);
  }
});

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    }
  });
  win.loadFile(path.resolve(__dirname,'../static/index.html'));
  //win.webContents.openDevTools()
}

app.whenReady().then(() => 
{
  ipcMain.handle("list", ()=>{
    return hosts;
  });
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })

});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    c.abort();
    app.quit()
  }
});