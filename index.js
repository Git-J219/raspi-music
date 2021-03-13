'use strict';
let mainWindow;
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

const createWindow = () => {
    // Create the browser window.
    const info = {
        frame: false,
        fullscreen: true,
        webPreferences: {
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js'),
            backgroundThrottling: false
        },
        icon: path.join(__dirname, 'icons', 'icon.png'),
        show: false
    };
    mainWindow = new BrowserWindow(info);
    mainWindow.on("ready-to-show", () => {
      mainWindow.show();
    });
    mainWindow.loadFile(path.join(__dirname, "index.html"));
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);
// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
ipcMain.on("quit", () => {
  app.quit();
});
