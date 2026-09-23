const { app, BrowserWindow } = require('electron')
const path = require('path')
function createWindow(){ const win = new BrowserWindow({width:1400,height:900,minWidth:960,minHeight:700,backgroundColor:'#10262b',webPreferences:{contextIsolation:true}}); win.loadFile(path.join(__dirname,'../dist/index.html')) }
app.whenReady().then(()=>{createWindow(); app.on('activate',()=>BrowserWindow.getAllWindows().length===0&&createWindow())})
app.on('window-all-closed',()=>{if(process.platform!=='darwin')app.quit()})
