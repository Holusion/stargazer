const path = require('path');
const {  Menu, app } = require('electron')


const isMac = process.platform === 'darwin'

const template = [{
    label: 'Menu',
    submenu : [
    { 
        label: 'Products',
        click: ()=>{
            app.relaunch(); 
            app.exit()
        }
    },
    isMac ? { role: 'close'}:{ role: 'quit'}
    ]},
    {label: 'View',
    submenu: [
    { role: 'reload' },
    { role: 'forceReload' },
    { role: 'toggleDevTools' }
    ]
}]
  
let menu = Menu.buildFromTemplate(template);

Menu.setApplicationMenu(menu) 


console.log("menu : ",menu)