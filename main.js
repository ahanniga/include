/**
 * Configure the Electron Window
 */
const {app, BrowserWindow, screen, shell} = require("electron");
const upath = require('upath');
const os = require('os');
const fs = require('fs');
const fse = require('fs-extra');

var wikiDir = ".include";
var homeDir = os.homedir();
var platform = os.platform;
var defaultsDir = upath.join(__dirname, "default-settings");
var tiddlyDir = upath.join(homeDir, wikiDir);
var port = 23981;
var mainWindow;
 
// If dirs does not exist, create and copy in server template
if (!fs.existsSync(tiddlyDir)) {
    fs.mkdirSync(tiddlyDir);
    // Apply default settings and tiddlers
    fse.copySync(`${defaultsDir}/`, `${tiddlyDir}/`);
}
 
// Start tiddlywiki
var $tw = require('tiddlywiki').TiddlyWiki();
$tw.boot.argv = [tiddlyDir, "--listen", "host=localhost", "port=" + port];
$tw.boot.boot();
 
function createWindow() {
    var {width, height} = screen.getPrimaryDisplay().workAreaSize;
    var icon = "";
 
    switch (platform) {
        case "win32":
            icon = "resources/include.ico";
            break;
        case "darwin":
            icon = "resources/include.icns";
            break;
        default:
            icon = "resources/include.png";
            break;
    }
 
    mainWindow = new BrowserWindow({
        width: width,
        height: height,
        icon: icon,
        webPreferences: {
            nodeIntegration: true,
            zoomFactor: 1.0,
        },
        backgroundColor: '#22272e',
        titleBarStyle: 'hidden',
        titleBarOverlay: true,
        autoHideMenuBar: true
    });

    mainWindow.loadURL("http://localhost:" + port);
    mainWindow.on("closed", function () {
        mainWindow = null;
    });
 
    mainWindow.webContents.on('new-window', function (e, url) {
        e.preventDefault();
        shell.openExternal(url);
    });
}
 
app.on("ready", createWindow);
app.on("resize", function (e, x, y) {
    mainWindow.setSize(x, y);
});
 
app.on("window-all-closed", function () {
    app.quit();
});
 
app.on("activate", function () {
    if (mainWindow === null) {
        createWindow();
    }
});
 
