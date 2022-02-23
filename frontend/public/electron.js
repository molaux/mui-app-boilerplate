/* eslint-disable no-console */
const electron = require('electron')

const isDev = require('electron-is-dev')
require('electron-reload')
const path = require('path')
const dotenv = require('dotenv')
const { autoUpdater } = require('electron-updater')

const { app, BrowserWindow, ipcMain } = electron

autoUpdater.autoDownload = false

if (isDev) {
  dotenv.config({
    path: path.resolve(
      path.join(
        __dirname,
        '..',
        `.env.${process.env.NODE_ENV === 'dev' ? 'development' : 'production'}`
      )
    )
  })
}

let mainWindow

function createWindow () {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 768,
    icon: path.join(__dirname, '/icons/icon.png'),
    backgroundColor: '#0e4194',
    frame: ((isDev && process.env.REACT_APP_DESKTOP_FRAMED) || 'yes') !== 'no',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: true,
      preload: path.join(__dirname, '/preload.js')
    }
  })

  if (!isDev) {
    mainWindow.setMenu(null)
    setTimeout(() => autoUpdater.checkForUpdatesAndNotify(), 2000)
  }

  if (isDev) {
    mainWindow.loadURL(`http://localhost:${process.env.REACT_APP_WEBPACK_DEV_SERVER_PORT}`)
  } else {
    mainWindow.loadFile(path.join(__dirname, 'index.html'))
  }

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  ipcMain.on('message', async (event, { action }) => {
    switch (action) {
      case 'minimizeWindow':
        mainWindow.minimize()
        break
      case 'toggleMaximizeWindow':
        mainWindow.isMaximized() ? mainWindow.unmaximize() : mainWindow.maximize()
        break
      case 'closeWindow':
        mainWindow.close()
        break
      case 'quit-and-update':
        autoUpdater.quitAndInstall()
        break
      default:
    }
  })

  const sendMessageToWindow = (event, payload) => {
    console.log('sendUpdaterStatusToWindow', event, payload)
    mainWindow.webContents.send('message', { action: event, payload })
  }

  autoUpdater.on('checking-for-update', () => {
    sendMessageToWindow('checking-for-update')
  })

  autoUpdater.on('update-available', (ev, info) => {
    autoUpdater.downloadUpdate()
    sendMessageToWindow(('update-available', info))
  })

  autoUpdater.on('update-not-available', (ev, info) => {
    sendMessageToWindow('update-not-available', info)
  })

  autoUpdater.on('error', (ev, err) => {
    sendMessageToWindow('update-error', err)
  })

  autoUpdater.on('download-progress', (ev, progressObj) => {
    sendMessageToWindow('download-progress', progressObj)
  })

  autoUpdater.on('update-downloaded', (ev, info) => {
    sendMessageToWindow('update-downloaded', info)
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
