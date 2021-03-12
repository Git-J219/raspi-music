document.querySelector("#app_close").addEventListener("click", () => {
  miscHelper.quit();
});

let clickedMain = false, clickedTitles = false, clickYMain, clickYTItles, startScrollYMain, startScrollYTitles;
const albumsContent = document.querySelector("#albums");
const titlesContent = document.querySelector("#titles");

/*
    <div class="album">
      <img class="albumPicture" src="test1.png">
      <span class="albumName">
        Album Sample
      </span>
    </div>
*/

let currentTitle = -1;
let albumSrcCurrent;
document.querySelector("#app_back").addEventListener("click", () => {
  document.querySelector("#app_back").style.display = "none";
  document.querySelector("#titles").style.display = "none";
  document.querySelector("#albums").style.display = "";
  document.querySelector("#titlesImage").style.display = "none";
  document.querySelector("#titleAlbum").style.display = "none";
  document.querySelector("audio").pause();
  currentTitle = -1;
});

document.querySelector("#pause").addEventListener("click", () => {
  document.querySelector("audio").pause();
});
document.querySelector("#play").addEventListener("click", () => {
  if(currentTitle != -1){
  document.querySelector("audio").play();}
});
document.querySelector("audio").addEventListener("play", () => {
  document.querySelector("#pause").style.display = "";
  document.querySelector("#play").style.display = "none";
});
document.querySelector("audio").addEventListener("pause", () => {
  document.querySelector("#pause").style.display = "none";
  document.querySelector("#play").style.display = "";
});
document.querySelector("#repeat").addEventListener("click", () => {
  document.querySelector("audio").loop = false;
  document.querySelector("#no-repeat").style.display = "";
  document.querySelector("#repeat").style.display = "none";
});
document.querySelector("#no-repeat").addEventListener("click", () => {
  document.querySelector("audio").loop = true;
  document.querySelector("#no-repeat").style.display = "none";
  document.querySelector("#repeat").style.display = "";
});
document.querySelector("audio").addEventListener("ended", () => {
  currentTitle++;
  if(currentTitle >= document.querySelector("#titles").children.length){
    currentTitle = 0;
  }
  document.querySelector("audio").src = document.querySelector("#titles").children[currentTitle].getAttribute("data-path");
  scanAndWriteTitles(albumSrcCurrent);
  document.querySelector("audio").play();
});

function createAlbum(albumSrc){
  const albumInfo = miscHelper.getAlbumInfo(albumSrc);
  let album = document.createElement("div");
  album.classList.add("album");
  let albumPicture = document.createElement("img");
  albumPicture.classList.add("albumPicture");
  albumPicture.src = albumInfo.img;
  album.appendChild(albumPicture);
  let albumTitle = document.createElement("span");
  albumTitle.classList.add("albumName");
  albumTitle.innerText = albumInfo.name;
  album.appendChild(albumTitle);
  album.addEventListener("click", () => {
    miscHelper.useCustomScroll && (clickedTitles = true);
    document.querySelector("#titlesImage").src = albumInfo.img;
    document.querySelector("#title").innerText = albumInfo.name;
    document.querySelector("#titles").innerHTML = "";
    scanAndWriteTitles(albumSrc);
    document.querySelector("#titles").style.display = "";
    document.querySelector("#albums").style.display = "none";
    document.querySelector("#app_back").style.display = "";
    document.querySelector("#titlesImage").style.display = "";
    document.querySelector("#titleAlbum").style.display = "";
  });
  return album;
}
function scanAndWriteTitles(albumSrc) {

    albumSrcCurrent = albumSrc;
  const titles = miscHelper.scanTitles(albumSrc);
  document.querySelector("#titles").innerHTML = "";
  for (var i = 0; i < titles[0].length; i++) {
    let title = document.createElement("div");
    let i1 = i;
    if(i === currentTitle) {
      title.classList.add("title-current");
      console.log("a");
    }
    title.addEventListener("click", () => {
      document.querySelector("audio").src = title.getAttribute("data-path");
      currentTitle = i1;
      console.log(i);
      console.log("b");
      document.querySelector("audio").play();
      scanAndWriteTitles(albumSrc);
    });
    title.classList.add("title")
    title.innerText = titles[1][i];
    title.setAttribute("data-path", titles[0][i]);
    document.querySelector("#titles").appendChild(title);
  }
}

function createAndAppendAlbum(albumSrc){
  document.querySelector("#albums").appendChild(createAlbum(albumSrc));
}

const albums = miscHelper.scanAlbums();
for (var i = 0; i < albums.length; i++) {
  console.log(albums[i]);
  createAndAppendAlbum(albums[i]);
}

if(miscHelper.useCustomScroll){

let updateScrollPos = function(e, element) {
    element.scrollTo(0, startScrollY + clickY - e.clientY);
}
albumsContent.addEventListener("mousemove", (e) => {
  clickedMain && updateScrollPos(e, albumsContent);
});

albumsContent.addEventListener("mousedown", (e) => {
  clickedMain = true;
  clickYMain = e.clientY;
  startScrollYMain = albumsContent.scrollTop;
});
window.addEventListener("mouseup", (e) => {
  clickedMain = false;
});

titlesContent.addEventListener("mousemove", (e) => {
  clickedTitles && updateScrollPos(e, titlesContent);
});

titlesContent.addEventListener("mousedown", (e) => {
  clickedTitles = true;
  clickYTitles = e.clientY;
  startScrollYTitles = titlesContent.scrollTop;
});
window.addEventListener("mouseup", (e) => {
  clickedTitles = false;
});
}
