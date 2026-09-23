const { app, BrowserWindow } = require('electron')
const path = require('path')

function createWindow() {
  const win = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 960,
    minHeight: 700,
    backgroundColor: '#10262b',
    webPreferences: {
      contextIsolation: true,
    },
  })
  const indexPath = path.join(__dirname, '..', 'dist', 'index.html')

  win.webContents.on('did-fail-load', (_event, errorCode, errorDescription, validatedURL) => {
    console.error(`Renderer failed to load (${errorCode}): ${errorDescription} at ${validatedURL}`)
  })
  win.webContents.on('render-process-gone', (_event, details) => {
    console.error(`Renderer process exited: ${details.reason}`)
  })
  win.loadFile(indexPath)
}

app.whenReady().then(() => {
  createWindow()
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
