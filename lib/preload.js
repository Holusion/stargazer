const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld(
  'scanner',
  {
    list: ()=>ipcRenderer.invoke("list"),
  }
)