'use strict';
const {ipcRenderer, contextBridge} = require("electron");
const path = require("path");
const fs = require("fs-extra");
const url = require("url");
const os = require("os");
const child_process = require("child_process");

function readIfExist(fPath){
  return fs.existsSync(fPath) ? fs.readJSONSync(fPath) : {};
}

const settings = readIfExist(path.join(os.homedir(), "raspi-music-config.json"));

let autoReloadWatcher = fs.watch(path.join(os.homedir(), "raspi-music"));

contextBridge.exposeInMainWorld("miscHelper", {
  registerReloader: (fn) => {
    autoReloadWatcher.on('change', (type) => {
      if(type === "rename"){
        fn();
      }
    });
  },
  quit: () => {
    autoReloadWatcher.close();
    if(settings.customQuit){
      document.querySelector("#shutdownImg").src = url.pathToFileURL(settings.quitImage).href;
      document.querySelector("#shutdownImg").style.display = "block";
      child_process.exec(settings.quitScript);
    }else{
      ipcRenderer.send("quit");
    }
  },
  getAlbumInfo: (albumSrc) => {
    let info = {};
    info.img = fs.existsSync(path.join(albumSrc, "cover.png")) ? url.pathToFileURL(path.join(albumSrc, "cover.png")).href : "albumDefaultImg.png";
    info.name = readIfExist(path.join(albumSrc, "album.json")).name;
    if(!info.name){
      info.name = path.parse(albumSrc).name;
    }
    return info;
  },
  scanTitles: (albumSrc) => {
    const titles = fs.readdirSync(albumSrc).filter(el => {console.log(el);return el != "cover.png" && el != "album.json" && el != "desktop.ini"});
    const info = readIfExist(path.join(albumSrc, "album.json"));
    return([titles.map(el => {
      return url.pathToFileURL(path.join(albumSrc, el)).href;
    }), titles.map(el => {
      return info[el] ? info[el] : el;
    })]);
  },
  scanAlbums: () => {
    return fs.readdirSync(path.join(os.homedir(), "raspi-music"), { withFileTypes: true }).filter(dirent => {return dirent.isDirectory()}).map(dirent => {return path.join(os.homedir(), "raspi-music", dirent.name)})
  },
  useCustomScroll: !!settings.useCustomScroll
});
