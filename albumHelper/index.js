const mm = require("music-metadata");
const fs = require("fs-extra");
const path = require("path");
async function readData() {
  const files = fs.readdirSync(process.cwd()).filter(el => {
    return el != "album.json" && el != "cover.png" && el != "desktop.ini";
  });
  const names = [];
  for (var i = 0; i < files.length; i++) {
    names[i] = (await mm.parseFile(path.join(process.cwd(), files[i]))).common.title;
  }
  return [files, names];
}

readData().then((fn) => {
  const vals = require(path.join(process.cwd(), "album.json"));
  for (var i = 0; i < fn[0].length; i++) {
    if(fn[1][i]){
    vals[fn[0][i]] = fn[1][i];
  }
  }
  console.log(JSON.stringify(vals, null, 4));
});
