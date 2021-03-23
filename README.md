# raspi-music
## Was ist das
raspi-music läuft auf dem Raspberry Pi.
Mit raspi-music kannst du den Raspberry Pi zu einem einfachen Musikplayer machen.
## Installation
1. Raspberry Pi OS installieren (du findest Anleitungen im Internet)
2. Node JS installieren (Anleitung von https://github.com/nodesource/distributions/blob/master/README.md#deb)
  1. Im Terminal: `sudo curl -fsSL https://deb.nodesource.com/setup_15.x | bash -
`
  2. Auch im Terminal: `sudo apt-get install -y nodejs`
3. (optionale Schritte):
  1. Desktopbild ändern
  2. Splashscreen ändern:
    1. Bild auf den Raspberry Pi laden
    2. Bild als splash.png zu /usr/share/plymouth/themes/pix laden
  3. Bootinfo entfernen: `#` vor diesen Zeilen in der Datei /usr/share/plymouth/themes/pix/pix.script einfügen: `message_sprite = Sprite();`,
`message_sprite.SetPosition(screen_width * 0.1, screen_height * 0.9, 10000);`,
`my_image = Image.Text(text, 1, 1, 1);` und
`message_sprite.SetImage(my_image);`
4. Programm einrichten
  1. Im Ordner /home/pi `git clone --depth 1 https://github.com/Git-J219/raspi-music rm` ausführen
  2. Im Ordner /home/pi die Datei raspi-music-config.json mit diesem Inhalt erstellen: `{
    "useCustomScroll": false,
    "customQuit": true,
    "quitScript": "shutdown -h now"
    }`
  3. Im Ordner /home/pi den Ordner raspi-music erstellen
4. Autostart einrichten:
  1. In der Datei /etc/xdg/lxsession/LXDE-pi/autostart die Zeilen `@lxpanel --profile LXDE-pi` und `@xscreensaver -no-splash` entfernen
  2. Im Ordner /home/pi die Datei rmstart.sh mit diesem Inhalt erstellen: `npm start --prefix /home/pi/rm`  
  `lxpanel --profile LXDE-pi`
  3. Im Ordner /etc/xdg/autostart die Datei rm.desktop mit diesem Inhalt erstellen:  
  `[Desktop Entry]`  
  `Type=Application`  
  `Exec=/home/pi/rmstart.sh`  

## Albumformat  
Im /home/pi/raspi-music Ordner machst du Alben rein.  
Ein Album ist so aufgebaut:  

Albumname  
├─ album.json (siehe weiter unten)  
├─ cover.png  
└─ Titel 1.mp3  

album.json ist so aufgebaut:  
{"name": \<Hier der Name des Albums\>, \<Beliebiger Titel\>: \<Name des Titels\>}
