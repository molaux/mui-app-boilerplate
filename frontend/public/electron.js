/* eslint-disable no-console */

const electron = require('electron')

const { app } = electron
const { BrowserWindow } = electron
const isDev = require('electron-is-dev')
require('electron-reload')
const path = require('path')
const dotenv = require('dotenv')

console.log(dotenv.config({ path: path.resolve(process.cwd(), `.env.${process.env.NODE_ENV === 'dev' ? 'development' : 'production'}`) }))
console.log('setting', process.env.REACT_APP_DESKTOP_FRAMED)
let mainWindow

function createWindow () {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 768,
    backgroundColor: '#0e4194',
    frame: (process.env.REACT_APP_DESKTOP_FRAMED || 'no') !== 'no',
    webPreferences: {
      nodeIntegration: false,
      preload: path.join(__dirname, '/preload.js')
    }
  })

  if (!isDev) {
    mainWindow.setMenu(null)
  }

  mainWindow.loadURL(isDev
    ? 'http://localhost:3000'
    : `file://${path.join(__dirname, '../build/index.html')}`)

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})
