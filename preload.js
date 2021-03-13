const {ipcRenderer, contextBridge, shell} = require("electron");
const path = require("path");
const fs = require("fs-extra");
const url = require("url");
const os = require("os");

const settings = fs.existsSync(path.join(os.homedir(), "raspi-music-config.json")) ? require(path.join(os.homedir(), "raspi-music-config.json")) : {}

contextBridge.exposeInMainWorld("miscHelper", {
  quit: () => {
    if(settings.customQuit){
      document.querySelector("#shutdownImg").src = url.pathToFileURL(settings.quitImage).href;
      document.querySelector("#shutdownImg").style.display = "block";
      shell.openExternal(settings.quitScript);
    }else{
      ipcRenderer.send("quit");
    }
  },
  getAlbumInfo: (albumSrc) => {
    let info = {};
    info.img = fs.existsSync(path.join(albumSrc, "cover.png")) ? url.pathToFileURL(path.join(albumSrc, "cover.png")).href : "albumDefaultImg.png";
    info.name = require(path.join(albumSrc, "album.json")).name;
    return info;
  },
  scanTitles: (albumSrc) => {
    const titles = fs.readdirSync(albumSrc).filter(el => {console.log(el);return el != "cover.png" && el != "album.json" && el != "desktop.ini"});
    const info = require(path.join(albumSrc, "album.json"));
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
