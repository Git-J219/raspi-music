const {ipcRenderer, contextBridge} = require("electron");


contextBridge.exposeInMainWorld("miscHelper", {
  quit: () => {
    ipcRenderer.send("quit");
  }
});
