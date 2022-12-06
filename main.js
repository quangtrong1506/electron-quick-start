const { app, BrowserWindow, screen, globalShortcut } = require('electron');
const path = require('path');

function createWindow() {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        width: 1300,
        height: 900,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
        },
        minimizable: false,
        resizable: true,
        frame: false,
        x: 0,
        y: 0,
    });

    // and load the index.html of the app.
    mainWindow.loadFile('index.html');
    // cho nó xuống dưới
    mainWindow.blur();
    //xóa menu mặc định
    mainWindow.removeMenu();
    // Max size
    mainWindow.maximize();
    // bỏ qua taskbar
    mainWindow.setSkipTaskbar(true);

    // mainWindow.webContents.openDevTools();
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
