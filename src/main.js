window.onload = () => {
    loadTable();
    if (localStorage.getItem('bg')) bgg = JSON.parse(localStorage.getItem('bg'));
    setBGView();
};
let control = {
    zoneid: -1,
    mapid: -1,
    skill: -1,
    isKSBoss: false,
    hpKSBOSS: 0,
};
function setBGView() {
    document.getElementById('bg').style.backgroundImage =
        'url(' + 'src/images/' + (bgg.type == 0 ? 'bg.png' : 'bg2.png') + ')';
    document.getElementById('bg').style.opacity = bgg.opacity;
}
function confirmDeleteAccount(id) {
    Swal.fire({
        title: 'Xác nhận xóa ?',
        html: `Vui lòng xác nhận xóa tài khoản [<span style="color: #1B9C85">${
            Accounts.getAccountById(id).username
        }</span>]!`,
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Xóa nó',
        cancelButtonText: 'Hủy',
        focusConfirm: false,
    }).then((result) => {
        if (result.isConfirmed) {
            deleteAccount(id);
        }
    });
}

function loadTable() {
    Accounts.load();
    let tableBody = document.getElementById('table-body');
    tableBody.innerHTML = '';
    if (listAccount.length == 0)
        tableBody.innerHTML = `<tr><td class="text-center" style="width:100%">Chưa có tài khoản nào <span class="add--btn" onclick="editAccountPaint()">thêm mới</span></td></tr>`;
    listAccount.forEach((account, index) => {
        tableBody.innerHTML += `<tr>
            <th class="stt" scope="row">${index + 1}</th>
            <td class="ten" width="150">${account.username}</td>
            <td class="text-center sv">${account.server}</td>
            <td class="gt">${account.note}</td>
            <td class="text-center  table-group-button d-flex justify-content-between" width="80">
            <div>
                <i class="bi bi-play-circle run--btn" title="Chạy" onclick="runAccount('${
                    account.id
                }')"></i>
            </div>
            <div>
                <i class="bi bi-pencil-square edit--btn" title="Sửa" onclick="editAccount('${
                    account.id
                }')"></i>
            </div>
            <div>
                <i class="bi bi-trash del--btn" title="Xóa" onclick="confirmDeleteAccount('${
                    account.id
                }')"></i>
            </div>
        </td>
        </tr>`;
    });
    if (listAccount.length > 0) document.getElementById('tb-add').style.display = 'inline-block';
    else document.getElementById('tb-add').style.display = 'none';
}
function deleteAccount(username) {
    if (Accounts.deleteAccountById(username))
        Swal.fire('Đã xóa!', 'Bạn đã xóa tài khoản thành công.', 'success');
    else Swal.fire('Lỗi!', 'Đã sảy ra lỗi gì đó.', 'error');
    loadTable();
}
function runAccount(id) {
    let account = Accounts.getAccountById(id);
    window.electronAPI.runApp(account);
    thongBaoKhiAnChay(account.username);
}

function thongBaoKhiAnChay(username) {
    Swal.fire({
        title: `Đang khởi động tài khoản [<span style="color: #1B9C85">${username}</span>]`,
        timer: 2000,
        timerProgressBar: true,
        didOpen: () => {
            Swal.showLoading();
        },
    });
}
function editAccount(id) {
    editAccountPaint(id);
}
function editAccountPaint(id) {
    let title = 'Thêm tài khoản mới',
        username = '',
        password = '',
        note = '',
        serverText = '';
    let max = localStorage.getItem('server-max') ? parseInt(localStorage.getItem('server-max')) : 1;
    if (id) {
        let account = Accounts.getAccountById(id);
        if (account) {
            username = account.username;
            password = account.password;
            server = account.server;
            note = account.note;
            for (let i = 0; i < max; i++) {
                let check = account.server == i + 1 ? 'selected' : '';
                serverText += `<option value="${i + 1}" ${check}>Server ${i + 1}</option>`;
            }
        }
    } else {
        for (let i = 0; i < max; i++) {
            serverText += `<option value="${i + 1}">Server ${i + 1}</option>`;
        }
    }
    Swal.fire({
        title: title,
        html: `<div class="zxcvbnm">
                    <div class="mb-1">
                        <label for="username" class="form-label">Tài khoản</label>
                        <input type="text" class="form-control" id="username" placeholder="" value="${username}">
                    </div>
                    <div class="mb-1">
                        <label for="password" class="form-label">Mật khẩu</label>
                        <input type="text" class="form-control" id="password" placeholder="" value="${password}">
                    </div>
                    <div class="mb-1">
                        <label for="server" class="form-label">Server</label>
                        <select id="server" class="form-select" aria-label="Vui lòng chọn server">
                            ${serverText}
                        </select>
                    </div>
                    <div class="mb-1">
                        <label for="note" class="form-label">Ghi chú</label>
                        <textarea class="form-control" id="note" rows="3" >${note}</textarea>
                    </div>
                </div>`,
        showCancelButton: true,
        showCloseButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Lưu lại',
        cancelButtonText: 'Hủy',
        focusConfirm: false,
    }).then((result) => {
        if (result.isConfirmed) {
            let username = document.getElementById('username').value;
            let password = document.getElementById('password').value;
            let server = document.getElementById('server').value;
            let note = document.getElementById('note').value;
            if (id && Accounts.editAccount(id, username, password, server, note)) {
                Swal.fire('Thành công!', 'Chỉnh sửa thông tin tài khoản thành công.', 'success');
                loadTable();
            } else if (Accounts.add(username, password, server, note)) {
                Accounts.save();
                Swal.fire('Thành công!', 'Bạn đã thêm tài khoản thành công.', 'success');
                loadTable();
            } else {
                let text = 'Chưa nhập đầy đủ thông tin';
                if (username && password && server)
                    text = `Tài khoản [<span style="color: #1B9C85">${username}</span>] đã tồn tại`;
                Swal.fire('Lỗi!', text);
            }
        }
    });
    document.getElementById('username').focus();
}

function writeMapToView(id) {
    document.getElementById('text-map').innerHTML = getMapName(id);
}
function ConvertHPBossToText(n) {
    let text = n;
    if (n >= 0) {
        control.hpKSBOSS = parseInt(n);
    }
    if (n > 1000) text = (n / 1000).toFixed(2) + ' nghìn';
    document.getElementById('hp-text').innerText = text;
    if (n > 1000 * 1000) text = (n / (1000 * 1000)).toFixed(2) + ' triệu';
    document.getElementById('hp-text').innerText = text;
    if (n > 1000 * 1000 * 1000) text = (n / (1000 * 1000 * 1000)).toFixed(2) + ' tỷ';
    document.getElementById('hp-text').innerText = text;
}

function VaoKhu(id) {
    if (id) {
        control.skill = -1;
        control.mapid = -1;
        Swal.fire('Vào khu', `Đang vào khu [ <span style="color: #1B9C85">${id}</span> ]`);
        control.zoneid = parseInt(id);
        sendControl();
    } else Swal.fire('Lỗi!', 'Vui lòng nhập số khu muốn vào');
}
function DenMap(id) {
    if (id || id == 0) {
        control.skill = -1;
        control.zoneid = -1;
        if (getMapName(id) == 'Map không tồn tại')
            return Swal.fire('Lỗi!', 'Map không tồn tại hoặc chưa được cập nhật');
        Swal.fire(
            'Chạy đến map',
            `Đang chạy đến map [ <span style="color: #1B9C85">${getMapName(id)}</span> ]`
        );
        control.mapid = parseInt(id);
        sendControl();
    } else Swal.fire('Lỗi!', 'Vui lòng nhập id map muốn đến');
}

function WriteHPBoss(hp) {
    if (hp) {
        control.mapid = -1;
        control.zoneid = -1;
        control.skill = -1;
        Swal.fire(
            'Thành công',
            `Lưu hp boss thành công [ <span style="color: #1B9C85">${hp}</span> ]`
        );
        sendControl();
    } else Swal.fire('Lỗi!', 'Vui lòng nhập hp boss');
}
function setTextAutoChat(text) {
    Swal.fire(
        'Thành công',
        `Đã set text auto chat thành [ <span style="color: #1B9C85">${text}</span> ]`
    );
    window.electronAPI.sendTextAutoChat(text);
}
function setTextCTG(text) {
    Swal.fire(
        'Thành công',
        `Đã set text auto chat thế giới thành [ <span style="color: #1B9C85">${text}</span> ]`
    );
    window.electronAPI.sendTextCTG(text);
}

function WriteWidth(n) {
    let w = document.getElementById('width').value;
    let h = document.getElementById('height').value;
    let o = {
        width: w,
        height: h,
        speed: 3,
    };
    window.electronAPI.changeSite(o);
}
function WriteHeight(n) {
    let w = document.getElementById('width').value;
    let h = document.getElementById('height').value;
    let o = {
        width: w,
        height: h,
        speed: 3,
    };
    window.electronAPI.changeSite(o);
}
function setIsKSBoss(value) {
    control.mapid = -1;
    control.zoneid = -1;
    control.skill = -1;
    console.log('value: ' + value);
    if (value) Swal.fire('Bật KS boss');
    else Swal.fire('Tắt KS boss');
    control.isKSBoss = value;
    sendControl();
}
function PaintSetting() {
    let pathImg = bgg.type == 1 ? 'bg2.png' : 'bg.png';
    let ip = localStorage.getItem('ip-game')
        ? localStorage.getItem('ip-game')
        : 'Nro Nato:103.200.20.107:14445:0,0,0';

    let version = localStorage.getItem('version-game')
        ? localStorage.getItem('version-game')
        : 'Dragonboy_vn_v225';

    let max = localStorage.getItem('server-max') ? parseInt(localStorage.getItem('server-max')) : 1;
    Swal.fire({
        title: 'Cài đặt',
        html: `<div class="zxcvbnm">
                    <div class="mb-1">
                        <label class="form-label">Hình nền</label>
                        <label style="position:relative" for="chonhinhnen"  title="Ấn để thay hình nền">
                            <img id="output" src="src/images/${pathImg}" width="100%">
                            <span class="span-an">Ấn để chọn hình nền mới</span>
                        </label>
                        <input id="chonhinhnen" type="file" style="display:none" accept=".png,.jpeg,.jpg" >
                    </div>
                    <div class="mb-1">
                        <label class="form-label">Độ trong suốt nền: <span id="pt"></span></label>
                        <input id="chondotrongsuot" class="form-range"  type="range" oninput="changePT(this.value)" min="0" max="100">
                    </div>
                    <div class="mb-1">
                        <label for="password" class="form-label">IP game</label>
                        <input type="text" class="form-control" id="ip-game" placeholder="" value="${ip}">
                    </div>
                    <div class="mb-1">
                        <label for="server-max" class="form-label">Số lượng server</label>
                        <input type="number" class="form-control" id="server-max" placeholder="" min="1" value="${max}">
                    </div>
                    <div class="mb-1">
                        <label for="version-game" class="form-label">Phiên bản game</label>
                        <input type="text" class="form-control" id="version-game" placeholder=""  value="${version}">
                    </div>
                </div>`,
        showCancelButton: true,
        showCloseButton: true,
        showDenyButton: true,
        confirmButtonColor: '#3085d6',
        denyButtonColor: '#4942E4',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Lưu lại',
        cancelButtonText: 'Hủy',
        denyButtonText: 'Mặc định',
        focusConfirm: false,
    }).then((result) => {
        if (result.isConfirmed) {
            localStorage.setItem('bg', JSON.stringify(bgg));
            if (document.getElementById('chonhinhnen').value)
                window.electronAPI.uploadImage(document.getElementById('output').src);
            window.electronAPI.saveIPGame(document.getElementById('ip-game').value);
            window.electronAPI.saveVersionGame(version);
            localStorage.setItem('ip-game', document.getElementById('ip-game').value);
            localStorage.setItem('version-game', document.getElementById('version-game').value);
            localStorage.setItem('server-max', document.getElementById('server-max').value);
        } else if (result.isDenied) {
            bgg.type = 0;
            bgg.opacity = 0.1;
            localStorage.setItem('bg', JSON.stringify(bgg));
            document.getElementById('bg').style.opacity = bgg.opacity;
            document.getElementById('bg').style.backgroundImage =
                'url(src/images/' + (bgg.type == 0 ? 'bg.png' : 'bg2.png') + ')';
            localStorage.removeItem('ip-game');
            localStorage.removeItem('version-game');
            localStorage.removeItem('server-max');
            window.electronAPI.saveIPGame(ip);
            window.electronAPI.saveVersionGame(version);
            xoaMangBoss();
        } else {
            document.getElementById('chonhinhnen').value = '';
            let bgx = JSON.parse(localStorage.getItem('bg'));
            if (bgx) bgg = bgx;
            document.getElementById('bg').style.opacity = bgg.opacity;
            document.getElementById('bg').style.backgroundImage =
                'url(src/images/' + (bgg.type == 0 ? 'bg.png' : 'bg2.png') + ')';
        }
    });
    document.getElementById('chonhinhnen').onchange = (evt) => {
        const [file] = document.getElementById('chonhinhnen').files;
        const fr = new FileReader();
        if (file) {
            fr.addEventListener('load', function (evt) {
                let path = evt.target.result;
                document.getElementById('output').src = path;
                bgg.type = 1;
                document.getElementById('bg').style.backgroundImage = 'url(' + path + ')';
            });
            fr.readAsDataURL(file);
        }
    };
    document.getElementById('pt').innerHTML = bgg.opacity * 100 + '%';
    document.getElementById('chondotrongsuot').value = bgg.opacity * 100;
    document.querySelector('.swal2-close').addEventListener('click', cancelST);
    document.querySelector('.swal2-container').addEventListener('click', (e) => {
        if (
            e.target.classList.contains('swal2-container') &&
            e.target.classList.contains('swal2-center') &&
            e.target.classList.contains('swal2-backdrop-hide')
        ) {
            cancelST();
        }
    });
    function cancelST() {
        document.getElementById('chonhinhnen').value = '';
        let bgx = JSON.parse(localStorage.getItem('bg'));
        if (bgx) bgg = bgx;
        else
            bgg = {
                type: 0,
                type: 0.1,
            };
        document.getElementById('bg').style.opacity = bgg.opacity;
        document.getElementById('bg').style.backgroundImage =
            'url(src/images/' + (bgg.type == 0 ? 'bg.png' : 'bg2.png') + ')';
    }
}
let bgg = {
    type: 0,
    opacity: 0.1,
};
function changePT(value) {
    let opacity = value / 100;
    bgg.opacity = opacity;
    document.getElementById('pt').innerHTML = value + '%';
    document.getElementById('bg').style.opacity = opacity;
}

function useSkill(params) {
    control.mapid = -1;
    control.zoneid = -1;
    control.skill = parseInt(params.innerText);
    sendControl();
}

function sendControl() {
    console.log(control);
    window.electronAPI.sendControl(control);
}

function xoaMangBoss() {
    window.electronAPI.xoaMangBoss();
}
