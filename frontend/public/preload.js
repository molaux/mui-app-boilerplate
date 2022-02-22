/* eslint-disable import/no-extraneous-dependencies */
const electron = require('electron')

const { contextBridge, ipcRenderer } = electron

process.once('loaded', (...args) => {
  contextBridge.exposeInMainWorld('electron', {
    sendMessage: (message) => ipcRenderer.send('message', message),
    onResponse: (listener) => ipcRenderer.on(
      'response',
      (event, resp) => listener(resp)
    )
  })
})
