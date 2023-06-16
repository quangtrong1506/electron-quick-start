const { app, BrowserWindow, ipcMain, Tray, Menu } = require('electron');
const path = require('path');
var fs = require('fs');
const isDev = require('electron-is-dev');
let mainWindow = null,
    verg,
    tray,
    checkClose;
function createWindow() {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        title: 'Quản lý tài khoản NRO',
        width: 1100,
        height: 600,
        minHeight: 450,
        minWidth: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
        },
        resizable: true,
        icon: path.join(__dirname, './src/images/logo.ico'),
    });

    // and load the index.html of the app.
    mainWindow.loadFile('index.html');
    mainWindow.removeMenu();
    // mainWindow.webContents.openDevTools();
    mainWindow.on('close', function (e) {
        if (!checkClose) {
            e.preventDefault();
            mainWindow.hide();
        } else app.exit();
    });
}

app.whenReady().then(() => {
    createWindow();
    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
    if (!isDev) {
        tray = new Tray('resources/app/icon.ico');
        let contextMenu = Menu.buildFromTemplate(trayMenu());
        tray.setContextMenu(contextMenu);
        tray.setToolTip('Quản lý tài khoản nro');
        tray.on('click', () => {
            mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show();
        });
    } else mainWindow.webContents.openDevTools();

    /// logic giao diện
    ReadDataInFileOnload();
    ipcMain.on('run-app', runApp);
    ipcMain.on('change-site', changeSite);
    // ipcMain.on('change-hp', changeHP);
    // ipcMain.on('change-isKS', changeIsKS);
    ipcMain.on('upload-image', uploadImage);
    ipcMain.on('save-ip', saveIP);
    ipcMain.on('save-version', saveVersion);
    ipcMain.on('save-text-ctg', saveTextCTG);
    ipcMain.on('save-text-auto-chat', saveTextChat);
    ipcMain.on('send-control', sendControl);
    setInterval(() => {
        readFileTB();
    }, 1000);
});
// app.on('window-all-closed', function () {
//     if (process.platform !== 'darwin') app.quit();
// });

function LaunchExe() {
    var child = require('child_process').execFile;
    var executablePath = path.join(__dirname, 'game', verg + '.exe');
    sendLog(executablePath);
    var parameters = [];
    child(executablePath, parameters, function (err, data) {
        if (err) {
            sendLog(err, 1);
            writeFile('main-log.txt', err);
        }
    });
}
function runApp(event, options) {
    let data = 'username:' + options.username;
    data += '|password:' + options.password;
    data += '|server:' + options.server;
    writeFile('game\\data\\acclogin.txt', data, LaunchExe);
}
function changeSite(event, options) {
    let data = 'width:' + options.width;
    data += '\nheight:' + options.height;
    data += '\nspeed:' + options.speed || 3;
    writeFile('game\\data\\setting.txt', data);
}
function writeFile(path, data, callback) {
    try {
        fs.writeFile(path, data, () => {
            if (callback) callback();
        });
    } catch (error) {
        sendLog(error, 1);
    }
}
function readFile(path, callback) {
    try {
        fs.readFile(path, {}, (err, data) => {
            if (callback) callback(data.toString());
        });
    } catch (error) {
        sendLog(error, 1);
    }
}
function uploadImage(e, base64) {
    let base64Data = base64.split(';base64,').pop();
    // let buff = Buffer.from(base64Data, 'base64');
    // fs.writeFileSync('stack-abuse-logo-out.png', buff);
    //file:///D:/create_app/QLTK_NRO/app/ung_dung_thoi_tiet/weather-win32-ia32/resources/app/src/images/bg2.png
    require('fs').writeFile(
        'resources/app/src/images/bg2.png',
        base64Data,
        { encoding: 'base64' },
        function (err) {
            sendLog(err, 1);
        }
    );
}

function saveIP(e, ip) {
    writeFile('game\\data\\ip.txt', ip);
}
function saveVersion(e, version) {
    writeFile('game\\data\\version.txt', version);
}
function saveTextChat(e, text) {
    writeFile('game\\data\\text_chat.txt', text);
}
function saveTextCTG(e, text) {
    writeFile('game\\data\\text_ctg.txt', text);
}
var z = null;
function sendControl(e, ctrl) {
    if (z) clearTimeout(z);
    z = setTimeout(() => {
        sendLog(ctrl, 0);
        var ctrl2 = {
            zoneid: -1,
            mapid: -1,
            skill: -1,
            isKSBoss: ctrl.isKSBoss || false,
            hpKSBOSS: ctrl.hpKSBOSS || 0,
        };
        let control = 'zoneId:' + ctrl2.zoneid;
        control += '|mapid:' + ctrl2.mapid;
        control += '|skill:' + ctrl2.skill;
        control += '|isKSBoss:' + ctrl2.isKSBoss;
        control += '|hpBoss:' + ctrl2.hpKSBOSS || 0;
        writeFile('game\\data\\control.txt', control);
    }, 1000);
    let control = 'zoneId:' + ctrl.zoneid;
    control += '|mapid:' + ctrl.mapid;
    control += '|skill:' + ctrl.skill;
    control += '|isKSBoss:' + ctrl.isKSBoss;
    control += '|hpBoss:' + ctrl.hpKSBOSS || 0;
    writeFile('game\\data\\control.txt', control);
}
function ReadDataInFileOnload() {
    readFile('game\\data\\setting.txt', (data) => {
        // send data to view
        let arr = data.split('\n');
        let op = {
            width: parseInt(arr[0].split(':')[1]),
            height: parseInt(arr[1].split(':')[1]),
            speed: parseInt(arr[2].split(':')[1]),
        };
        mainWindow.webContents.send('size', op);
    });
    readFile('game\\data\\hpboom.txt', (data) => {
        // send data to view
        let op = {
            hp: parseInt(data),
        };
        mainWindow.webContents.send('hp-boom', op);
    });
    readFile('game\\data\\ip.txt', (data) => {
        mainWindow.webContents.send('ip-game', data);
    });
    readFile('game\\data\\text_chat.txt', (data) => {
        mainWindow.webContents.send('text-atc', data);
    });
    readFile('game\\data\\text_ctg.txt', (data) => {
        mainWindow.webContents.send('text-ctg', data);
    });
    readFile('game\\data\\version.txt', (data) => {
        mainWindow.webContents.send('version-game', data);
        verg = data;
    });
}

function sendLog(text, type) {
    let log =
        '[main]' +
        '[' +
        (type == 0 ? 'log' : 'error') +
        ']' +
        '[' +
        new Date().toLocaleString() +
        '] ' +
        (typeof text == 'object')
            ? text.toString()
            : text;
    mainWindow.webContents.send('write-log', log);
}

function readFileTB() {
    readFile('game\\data\\tb.txt', (data) => {
        mainWindow.webContents.send('tb-boss', data);
    });
}
function readFileGiet() {
    readFile('game\\data\\giet.txt', (data) => {
        mainWindow.webContents.send('giet-boss', data);
    });
}
function trayMenu() {
    let innerMenu = [
        {
            label: 'Đóng QLTK',
            click: () => {
                checkClose = true;
                tray.destroy();
                app.quit();
            },
        },
        {
            label: 'Open devtool',
            click: () => {
                mainWindow.webContents.openDevTools();
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
