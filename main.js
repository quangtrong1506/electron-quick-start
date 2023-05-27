const { app, BrowserWindow } = require('electron');
const path = require('path');
let mainWindow = null;

function createWindow() {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 700,
        height: 400,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
        },
        resizable: true,
    });

    // and load the index.html of the app.
    mainWindow.loadFile('index.html');
    mainWindow.removeMenu();
    mainWindow.webContents.openDevTools();
}
function LaunchExe() {
    var child = require('child_process').execFile;
    var executablePath = path.join(__dirname, 'Dragonboy_vn_v225.exe');
    var parameters = [];
    child(executablePath, parameters, function (err, data) {
        console.log(err);
        console.log(data.toString());
    });
}

app.whenReady().then(() => {
    createWindow();
    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit();
});
