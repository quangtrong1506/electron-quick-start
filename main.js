const { app, BrowserWindow, screen, globalShortcut, Tray, Menu, shell } = require('electron');
const path = require('path');
const { off } = require('process');
let tray = null,
    mainWindow = null;

function createWindow() {
    // Create the browser window.
    mainWindow = new BrowserWindow({
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

    mainWindow.webContents.openDevTools();

    // Tray icon
    tray = new Tray('./src/images/logo.ico');
    let contextMenu = Menu.buildFromTemplate(trayMenu());
    tray.setContextMenu(contextMenu);
    tray.setToolTip('Màn hình nền tự build');

    tray.on('click', () => {
        mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show();
        mainWindow.blur();
    });
}

function trayMenu() {
    var text = mainWindow.isVisible() ? 'Ẩn hình nền' : 'Hiện hình nền';
    let innerMenu = [
        {
            label: 'Dừng',
            click: () => {
                app.quit();
            },
        },
        {
            label: text,
            click: () => {
                mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show();
                mainWindow.blur();

                let contextMenu = Menu.buildFromTemplate(trayMenu());
                tray.setContextMenu(contextMenu);
            },
        },
        {
            label: 'Liên hệ',
            click: () => {
                shell.openExternal('https://www.facebook.com/quangtrong.1506');
            },
        },
    ];
    return innerMenu;
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
