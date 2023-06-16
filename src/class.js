class Account {
    constructor(id, username, password, server, note) {
        this.id = id || createId();
        this.username = username || '';
        this.password = password || '';
        this.server = server || '';
        this.note = note || '';
    }
}

let Accounts = {
    add(username, password, server, note) {
        let account = listAccount.find((account) => account.username == username);
        if (account || !password || !server) return false;
        listAccount.push(new Account(null, username, password, server, note));
        return true;
    },
    save() {
        localStorage.setItem('data-account', JSON.stringify(listAccount));
        return listAccount;
    },
    load() {
        if (localStorage.getItem('data-account'))
            listAccount = JSON.parse(localStorage.getItem('data-account'));
        return listAccount;
    },
    getAccountByUserName(username) {
        return listAccount.find((account) => account.username == username);
    },
    getAccountById(id) {
        return listAccount.find((account) => account.id == id);
    },
    getUsernameById(id) {
        let username = null;
        let account = listAccount.find((account) => account.id == id);
        if (account) username = account.username;
        return;
    },
    editAccount(id, username, password, server, note) {
        let account = listAccount.find((account) => account.id == id);
        if (!account) return false;
        let index = listAccount.indexOf(account);
        listAccount[index] = new Account(id, username, password, server, note);
        this.save();
        return true;
    },
    deleteAccountByUsername(username) {
        let account = listAccount.find((account) => account.username == username);
        if (!account) return false;
        let index = listAccount.indexOf(account);
        listAccount.splice(index, 1);
        this.save();
        return true;
    },
    deleteAccountById(id) {
        let account = listAccount.find((account) => account.id == id);
        if (!account) return false;
        let index = listAccount.indexOf(account);
        listAccount.splice(index, 1);
        this.save();
        return true;
    },
    length() {
        return listAccount.length;
    },
};
function createId() {
    return (
        (Math.random() * 1000).toString(36).substring(2, 15) +
        (Math.random() * 1000).toString(36).substring(2, 15)
    );
}
function getMapName(id) {
    let mapName = mapList[id];
    let hanhtinh = 'Chưa xác định';
    let id2 = ' ' + id + ' ';
    if (idmapTD.match(id2)) hanhtinh = 'Trái đất';
    else if (idmapNM.match(id2)) hanhtinh = 'Namec';
    else if (idmapXD.match(id2)) hanhtinh = 'Xayda';
    else if (idmapNappa.match(id2)) hanhtinh = 'Nappa';
    else if (idmaptl.match(id2)) hanhtinh = 'Tương lai';
    else if (idmapCold.match(id2)) hanhtinh = 'Cold';
    else if (idmapHTTV.match(id2)) hanhtinh = 'Hành tinh thực vật';
    else if (idmapPotaufeu.match(id2)) hanhtinh = 'Potaufeu';
    else if (idmapGas.match(id2)) hanhtinh = 'Khí GAS';
    else if (idmapNHS.match(id2)) hanhtinh = 'Ngũ hành sơn';
    if (mapName) return mapName + ` _ ${hanhtinh}`;
    else return 'Map không tồn tại';
}
let listAccount = [];
let textMap =
    'Làng Aru,Đồi hoa cúc,Thung lũng tre,Rừng nấm,Rừng xương,Đảo Kamê,Đông Karin,Làng Mori,Đồi nấm tím,Thị trấn Moori,Thung lũng Namếc,Thung lũng Maima,Vực maima,Đảo Guru,Làng Kakarot,Đồi hoang,Làng Plant,Rừng nguyên sinh,Rừng thông Xayda,Thành phố Vegeta,Vách núi đen,Nhà Gôhan,Nhà Moori,Nhà Broly,Trạm tàu vũ trụ,Trạm tàu vũ trụ,Trạm tàu vũ trụ,Rừng Bamboo,Rừng dương xỉ,Nam Kamê,Đảo Bulông,Núi hoa vàng,Núi hoa tím,Nam Guru,Đông Nam Guru,Rừng cọ,Rừng đá,Thung lũng đen,Bờ vực đen,Vách núi Aru,Vách núi Moori,Vực Plant,Vách núi Aru,Vách núi Moori,Vách núi Kakarot,Thần điện,Tháp Karin,Rừng Karin,Hành tinh Kaio,Phòng tập thời gian,Thánh địa Kaio,Đấu trường,Đại hội võ thuật,Tường thành 1,Tầng 3,Tầng 1,Tầng 2,Tầng 4,Tường thành 2,Tường thành 3,Trại độc nhãn 1,Trại độc nhãn 2,Trại độc nhãn 3,Trại lính Fide,Núi dây leo,Núi cây quỷ,Trại qủy già,Vực chết,Thung lũng Nappa,Vực cấm,Núi Appule,Căn cứ Raspberry,Thung lũng Raspberry,Thung lũng chết,Đồi cây Fide,Khe núi tử thần,Núi đá,Rừng đá,Lãnh  địa Fize,Núi khỉ đỏ,Núi khỉ vàng,Hang quỷ chim,Núi khỉ đen,Hang khỉ đen,Siêu Thị,Hành tinh M-2,Hành tinh Polaris,Hành tinh Cretaceous,Hành tinh Monmaasu,Hành tinh Rudeeze,Hành tinh Gelbo,Hành tinh Tigere,Thành phố phía đông,Thành phố phía nam,Đảo Balê,95,Cao nguyên,Thành phố phía bắc,Ngọn núi phía bắc,Thung lũng phía bắc,Thị trấn Ginder,101,Nhà Bunma,Võ đài Xên bọ hung,Sân sau siêu thị,Cánh đồng tuyết,Rừng tuyết,Núi tuyết,Dòng sông băng,Rừng băng,Hang băng,Đông Nam Karin,Võ đài Hạt Mít,Đại hội võ thuật,Cổng phi thuyền,Phòng chờ,Thánh địa Kaio,Cửa Ải 1,Cửa Ải 2,Cửa Ải 3,Phòng chỉ huy,Đấu trường,Ngũ Hành Sơn,Ngũ Hành Sơn,Ngũ Hành Sơn,Võ đài Bang,Thành phố Santa,Cổng phi thuyền,Bụng Mabư,Đại hội võ thuật,Đại hội võ thuật Vũ Trụ,Hành Tinh Yardart,Hành Tinh Yardart 2,Hành Tinh Yardart 3,Đại hội võ thuật Vũ Trụ 6-7,Động hải tặc,Hang Bạch Tuộc,Động kho báu,Cảng hải tặc,Hành tinh Potaufeu,Hang động Potaufeu,Con đường rắn độc,Con đường rắn độc,Con đường rắn độc,Hoang mạc,Võ Đài Siêu Cấp,Tây Karin,Sa mạc,Lâu đài Lychee,Thành phố Santa,Lôi Đài,Hành tinh bóng tối,Vùng đất băng giá,Lãnh địa bang hội,Hành tinh Bill,Hành tinh ngục tù,Tây thánh địa,Đông thánh Địa,Bắc thánh địa,Nam thánh Địa,Khu hang động,Bìa rừng nguyên thủy,Rừng nguyên thủy,Làng Plant nguyên thủy,Tranh ngọc Namếc';
let mapList = textMap.split(',');
let idmapTD =
    ' 42 21 0 1 2 3 4 5 6 27 28 29 30 47 46 45 48 50 111 24 53 58 59 60 61 62 55 56 54 57 ';
let idmapNM = ' 43 22 7 8 9 11 12 13 10 31 32 33 34 25 ';
let idmapXD = ' 44 23 14 15 16 17 18 20 19 35 36 37 38 26 52 84 129 ';
let idmapNappa = ' 68 69 70 71 72 64 65 63 66 67 73 74 75 76 77 81 82 83 79 80 131 132 133 ';
let idmaptl = ' 102 92 93 94 96 97 98 99 100 103 ';
let idmapCold = ' 109 108 107 110 106 105 ';
let idmapHTTV = ' 160 161 162 163 ';
let idmapPotaufeu = ' 139 140 ';
let idmapGas = ' 149 147 152 151 148 ';
let idmapNHS = ' 122 123 124 ';
