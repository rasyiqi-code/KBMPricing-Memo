const { contextBridge } = require('electron')

// Expose safe platform indicator to window
contextBridge.exposeInMainWorld('electronAPI', {
  platform: process.platform,
  isElectron: true
})

