const { ipcRenderer, contextBridge } = require('electron');

window.addEventListener('DOMContentLoaded', () => {
    console.log('Connected');
    document.getElementById('width').value = w;
    document.getElementById('height').value = h;
    document.getElementById('text-chat').value = textATC;
    document.getElementById('text-ctg').value = textCTG;
    localStorage.setItem('ip-game', ip);
    localStorage.setItem('version-game', ver);
    if (localStorage.getItem('boss')) {
        arrBoss = JSON.parse(localStorage.getItem('boss'));
        arrBoss.forEach((element) => {
            element.time = new Date(`"${element.time}"`);
        });
    }
});

contextBridge.exposeInMainWorld('electronAPI', {
    runApp: (options) => ipcRenderer.send('run-app', options),
    changeSite: (options) => ipcRenderer.send('change-site', options),
    uploadImage: (path) => ipcRenderer.send('upload-image', path),
    saveIPGame: (ip) => ipcRenderer.send('save-ip', ip),
    saveVersionGame: (ver) => ipcRenderer.send('save-version', ver),
    sendControl: (ctrl) => ipcRenderer.send('send-control', ctrl),
    sendTextCTG: (text) => ipcRenderer.send('save-text-ctg', text),
    sendTextAutoChat: (text) => ipcRenderer.send('save-text-auto-chat', text),
    xoaMangBoss: xoaMangBoss,
});
let w, h, s, hp, ip, ver, textCTG, textATC, tb;
ipcRenderer.on('size', function (event, data) {
    console.log(data);
    w = data.width;
    h = data.height;
    s = data.speed;
});
ipcRenderer.on('hp-boom', function (event, data) {
    console.log(data);
    hp = data.hp;
});
ipcRenderer.on('ip-game', function (event, data) {
    console.log(data);
    ip = data;
});
ipcRenderer.on('version-game', function (event, data) {
    console.log(data);
    ver = data;
});
ipcRenderer.on('text-ctg', function (event, data) {
    console.log(data);
    textCTG = data;
});
ipcRenderer.on('text-atc', function (event, data) {
    console.log(data);
    textATC = data;
});
ipcRenderer.on('write-log', function (event, data) {
    console.log(data);
});
let arrBoss = [];
ipcRenderer.on('tb-boss', function (event, data) {
    tb = data;
    let a = tb.split('\n');
    for (let i = 0; i < a.length; i++) {
        let sb = ThongBaoBoss(a[i]);
        if (!sb) continue;
        if (checkBoss(sb.name) == -1) arrBoss.push(sb);
        else arrBoss[checkBoss(sb.name)] = sb;
    }
    if (document.getElementById('tb-list')) document.getElementById('tb-list').innerHTML = '';
    for (let i = 0; i < arrBoss.length; i++) {
        let sb = arrBoss[i];
        let tr = document.createElement('tr');
        let now = new Date();
        let t = now.getTime() - sb.time.getTime();
        let time = '';
        let s = Math.floor(t / 1000);
        let m = Math.floor(s / 60);
        let h = Math.floor(m / 60);
        if (s > 60 * 60) {
            let p = (s / (60 * 60) - h) * 60;
            time = h + 'h ' + Math.floor(p) + 'p trước';
        } else if (s > 60) {
            let g = (s / 60 - m) * 60;
            time = m + 'p ' + Math.round(g) + 's trước';
        } else time = s + ' giây trước';
        let st =
            sb.status == 1
                ? '<span style="color: green">Còn sống</span>'
                : '<span style="color: red">Đã chết</span>';
        tr.innerHTML = `
            <th scope="row">${i + 1}</th>
            <td>${sb.name}</td>
            <td>
            <span class="tb-den-map" 
                onclick="DenMap(${sb.mapid})">${sb.mapname} [${sb.mapid}]
            </span>
            </td>
            <td>${st}</td>
            <td>${time}</td>`;
        document.getElementById('tb-list').appendChild(tr);
    }
    localStorage.setItem('boss', JSON.stringify(arrBoss));
});

function checkBoss(nameBoss) {
    for (let i = 0; i < arrBoss.length; i++) {
        if (nameBoss.toLocaleLowerCase() == arrBoss[i].name.toLocaleLowerCase()) {
            return i;
        }
    }
    return -1;
}
function ThongBaoBoss(text) {
    try {
        let a = text.split('_');
        let name = a[0].split(':')[1];
        let mapname = a[1].split(':')[1];
        let mapid = a[2].split(':')[1];
        let status = a[3].split(':')[1];
        let time = a[4].replace('Time:', '');
        return {
            name: name,
            mapname: mapname,
            mapid: mapid,
            status: status,
            time: new Date(`"${time}"`),
        };
    } catch (error) {
        return null;
    }
}
function xoaMangBoss() {
    arrBoss = [];
    localStorage.setItem('boss', JSON.stringify(arrBoss));
}
