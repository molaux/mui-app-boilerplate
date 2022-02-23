/* eslint-disable import/no-extraneous-dependencies */
const electron = require('electron')

const { contextBridge, ipcRenderer } = electron

process.once('loaded', (...args) => {
  contextBridge.exposeInMainWorld('electron', {
    sendMessage: (message) => ipcRenderer.send('message', message),
    onMessage: (event, listener) => ipcRenderer.on(
      'message',
      (e, o) => (event === o.action ? listener(o) : null)
    )
  })
})
