window.onload = () => {
    //Todo set tọa độ của phần tử khi load

    // xóa sự kiện chuột phải mặc định
    document.oncontextmenu = function rightClick(clickEvent) {
        clickEvent.preventDefault();
        return false;
    };

    //Todo set font
    (function () {
        var newStyle = document.createElement('style');
        var styleInner = '';
        Font.forEach((element) => {
            styleInner += `@font-face {
                font-family: '${element.name}';
                src: url('src/fonts/${element.src}');
            }\n`;
        });
        newStyle.innerHTML = styleInner;
        document.body.appendChild(newStyle);
    })();

    //Todo set type background
    (() => {
        var type = document.getElementById('background').getAttribute('data-type') || 0;
        document.querySelectorAll('.background-view')[type].style.display = 'block';
        // if (type == 1) document.querySelector('.babckground-view video').play();
    })();
    (() => {
        var a = document.querySelectorAll('.select-font');
        a.forEach((element) => {
            var options = '';
            Font.forEach((element2) => {
                options += `<option value="${element2.name}" style="font-family: ${element2.name};">${element2.name}</option>`;
            });
            element.innerHTML = options;
        });
    })();
    var a = document.querySelectorAll('input[type="number"]');
    for (let i = 0; i < a.length; i++) {
        const element = a[i];
        // element.addEventListener('chan', function (e) {
        //     ;
        // });
        element.addEventListener('change', function x(e) {
            changeValueNumberInput(e.target);
            var value = e.target.value;
            if (!value) e.target.value = 0;
        });
    }
    function changeValueNumberInput(element) {
        var min = parseInt(element.min) || 0;
        var max = parseInt(element.max) || 0;
        var value = parseInt(element.value) || 0;
        if (value < min) {
            element.value = min;
            showMessage('Thông báo', 'Đã vượt qua giới hạn cho phép');
        }
        if (value > max) {
            element.value = max;
            showMessage('Thông báo', 'Đã vượt qua giới hạn cho phép');
        }
    }
    //Todo loadn dữ liệu "Text" khi load xong
    loadText();
    var x = document.querySelector('.background');
    x.addEventListener('mousemove', function () {
        document.querySelector('.background').removeEventListener('mousedown', a);
        mouseClickText('background');
    });
    x.addEventListener('mouseleave', function () {
        document.querySelector('.background').removeEventListener('mousedown', a);
    });
    (() => {
        document
            .querySelector('div.list-skin > div > div.header > div.end span.new-skin')
            .addEventListener('click', () => {
                var ul = document.querySelector('div.list-skin > div > div.header > div.end > ul');
                ul.style.display = 'block';
                ul.addEventListener('mouseleave', () => {
                    ul.style.display = 'none';
                });
                setTimeout(() => {
                    ul.style.display = 'none';
                }, 10000);
            });
    })();
};

var textDemo = new Text();

//? set sự kiện kéo thả của 1 element
function dragElement(elmnt) {
    if (!elmnt.id) elmnt = document.getElementById(elmnt);
    if (!elmnt) return;
    var pos1 = 0,
        pos2 = 0,
        pos3 = 0,
        pos4 = 0;
    elmnt.onmousedown = dragMouseDown;

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        //Todo get the mouse cursor position at startup:
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // set the element's new position:

        // y
        elmnt.style.top = elmnt.offsetTop - pos2 + 'px';
        // x
        elmnt.style.left = elmnt.offsetLeft - pos1 + 'px';

        var x = elmnt.style.left.toString().replace('px', ''),
            y = elmnt.style.top.toString().replace('px', '');
        var main = document.querySelector('body');
        var w = main.clientWidth,
            h = main.clientHeight;

        if (x < -50) {
            elmnt.style.left = '-50px';
            x = -50;
        }
        if (y < -50) {
            elmnt.style.top = '-50px';
            y = -50;
        }
        if (x > w + 50 - elmnt.clientWidth) {
            elmnt.style.left = w + 50 - elmnt.clientWidth + 'px';
            x = w + 50 - elmnt.clientWidth;
        }
        if (y > h + 50 - elmnt.clientHeight) {
            elmnt.style.top = h + 50 - elmnt.clientHeight + 'px';
            y = h + 50 - elmnt.clientHeight;
        }
        setNewPosition(elmnt.id, x, y);
    }

    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
    }
}
//Todo:
function onchangeValueTab1() {
    var text = document.querySelector('.tab .tab-1 .text-input').value;
    var size = document.querySelector('.tab .tab-1 .size-input').value;
    var font = document.querySelector('.tab .tab-1 .font-input').value;
    document.querySelector('.tab .tab-1 #bold').checked
        ? (textDemo.bold = 'bold')
        : (textDemo.bold = 'initial');
    document.querySelector('.tab .tab-1 #i').checked
        ? (textDemo.italic = 'italic')
        : (textDemo.italic = 'initial');

    if (!text) document.querySelector('.tab .tab-1 .text-input').style.borderColor = 'red';
    else document.querySelector('.tab .tab-1 .text-input').style.borderColor = 'black';

    textDemo.fontSize = size;
    textDemo.fontFamily = font;
    textDemo.text = text;

    setStyleTextDemo();
}
// Thay đổi tab trong chỉnh sửa văn bản
function changeTab(n) {
    var a = document.querySelectorAll('.tab > div');
    a.forEach((element) => {
        element.style.display = 'none';
    });
    if (a[n]) a[n].style.display = 'block';
}
// Thay đổi màu sắc ở đơn màu
function changeColor() {
    var color = document.querySelector('.tab .tab-2 .color-input').value;
    textDemo.color = color;
    setStyleTextDemo();
}
// lấy ngẫu nhiên màu ở đơn màu
function randomColorBtn() {
    var color = randomColor();
    textDemo.color = color;
    document.querySelector('.tab .tab-2 .color-input').value = color;

    setStyleTextDemo();
}

// Thay đổi loại màu của chữ
function changeTypeColor(event) {
    var select = typeof event == 'number' ? event : event.target.value;
    if (select == 0) {
        document.querySelector('.tab-2 .single').style.display = 'inline-block';
        document.querySelector('.tab-2 .multi').style.display = 'none';
        textDemo.colorType = 0;
        document
            .querySelector('.content .content-3 .demo .demo__text')
            .classList.remove('linear-gradient');
    } else if (select == 1) {
        document.querySelector('.tab-2 .single').style.display = 'none';
        document.querySelector('.tab-2 .multi').style.display = 'block';
        textDemo.colorType = 1;
        var a = document.querySelectorAll('.colorx4 input');
        a[0].value = textDemo.multiColor.color1;
        a[1].value = textDemo.multiColor.color2;
        a[2].value = textDemo.multiColor.color3;
        a[3].value = textDemo.multiColor.color4;
        document.querySelector('.multi-select').style.display = 'block';
    } else if (select == 2) {
        document.querySelector('.tab-2 .single').style.display = 'none';
        document.querySelector('.tab-2 .multi').style.display = 'block';
        textDemo.colorType = 2;
        document.querySelector('.multi-select').style.display = 'none';
    }
    setStyleTextDemo();
}
// Nhận tất cả thay đổi kiểu cho chữ hiển thị
function setStyleTextDemo() {
    var bg =
        textDemo.colorType == 1
            ? `background: -webkit-linear-gradient(${textDemo.multiColor.pos}, ${textDemo.multiColor.color1}, ${textDemo.multiColor.color2}, ${textDemo.multiColor.color3}, ${textDemo.multiColor.color4});
            -webkit-background-clip: text;`
            : `background: ${textDemo.backgroundColor}`;
    document.querySelector('.content .content-3 .demo .demo__text').setAttribute(
        'style',
        `font-size: ${textDemo.fontSize}px; font-weight: ${textDemo.bold};
             font-style: ${textDemo.italic};font-family: ${textDemo.fontFamily};
             color: ${textDemo.color}; ${bg}; padding:${textDemo.padding}px; border-radius: ${textDemo.borderRadius}px;
             border: ${textDemo.border.width}px solid ${textDemo.border.color}`
    );
    if (textDemo.colorType == 0) {
        document.querySelector('.content .content-3 .demo .demo__text').innerHTML = textDemo.text;
    } else if (textDemo.colorType == 1) {
        // linear color
        document
            .querySelector('.content .content-3 .demo .demo__text')
            .classList.add('linear-gradient');

        document.querySelector('.content .content-3 .demo .demo__text').innerHTML = textDemo.text;
    } else if (textDemo.colorType == 2) {
        var tmp = textDemo.text;
        document
            .querySelector('.content .content-3 .demo .demo__text')
            .classList.remove('linear-gradient');
        document.querySelector('.content .content-3 .demo .demo__text').innerHTML =
            randomColorColorText(tmp);
    }
}

//Todo: Thay đổi màu sắc ở dải màu
function change4Color() {
    textDemo.multiColor.color1 = document.querySelectorAll('.multi-select .colorx4 input')[0].value;
    textDemo.multiColor.color2 = document.querySelectorAll('.multi-select .colorx4 input')[1].value;
    textDemo.multiColor.color3 = document.querySelectorAll('.multi-select .colorx4 input')[2].value;
    textDemo.multiColor.color4 = document.querySelectorAll('.multi-select .colorx4 input')[3].value;
    setStyleTextDemo();
}

function changeDeg4Color() {
    textDemo.multiColor.pos = document.querySelector('.multi-select select').value;
    setStyleTextDemo();
}
function changePosition() {
    var xElement = document.querySelector('.content .content-2 .tab-4 .x-input');
    var yElement = document.querySelector('.content .content-2 .tab-4 .y-input');

    var x = xElement.value < 50 ? 50 : xElement.value > 1300 ? 1300 : xElement.value;
    var y = yElement.value < 50 ? 50 : yElement.value > 600 ? 600 : yElement.value;

    textDemo.x = parseInt(x);
    textDemo.y = parseInt(y);
}
function saveBtn2() {
    var id = document.querySelector('.edit-container').id;
    changePosition();
    if (!textDemo.text) {
        showMessage('Lỗi', 'Văn bản trống không thể lưu');
        changeTab(0);
        document.querySelector('.tab .tab-1 .text-input').focus();
        return;
    }
    saveBtn(id);
}
function saveBtn(id) {
    var arrText = JSON.parse(localStorage.getItem('Text')) || [];
    for (let i = 0; i < arrText.length; i++) {
        if (arrText[i].id == id) {
            //Cập nhật nếu tồn tại
            textDemo.time.updatedAt = getToday();
            arrText[i] = textDemo;
            showMessage('Thành công', 'Cập nhật dữ liệu thành công! Đã áp dụng');
            localStorage.setItem('Text', JSON.stringify(arrText));
            viewBlock(0);
            loadText();
            return;
        }
    }
    arrText.push(textDemo);
    showMessage('Thành công', 'Thêm dữ liệu mới thành công! Đã áp dụng');
    localStorage.setItem('Text', JSON.stringify(arrText));

    viewBlock(0);
    loadText();
}

//Todo: Hiện thông báo
function showMessage(title, message, type) {
    var element = document.createElement('div');
    element.className = 'message__container';
    element.innerHTML = `
    <div class="title">${title}</div>
    <div class="mes">${message}</div>
    <div class="close-btn">×</div>
    <div class="bottom-time"></div>
    `;
    element.addEventListener('click', (e) => {
        if (e.target.classList.contains('close-btn')) {
            var a = setInterval((event) => {
                element.style.opacity -= 0.1;
                if (element.style.opacity < 0) {
                    clearInterval(a);
                    element.remove();
                }
            }, 100);
        }
    });
    setTimeout((event) => {
        var a = setInterval(() => {
            element.style.opacity -= 0.1;
            if (element.style.opacity < 0) {
                clearInterval(a);
                element.remove();
            }
        }, 100);
    }, 3500);
    document.querySelector('.message').appendChild(element);
}

function loadText() {
    var a = JSON.parse(localStorage.getItem('Text')) || [];
    document.querySelector('.text-container').innerHTML = '';
    for (let i = 0; i < a.length; i++) {
        const element = a[i];
        if (element.status == 1) {
            var newE = document.createElement('div');
            newE.classList = 'text ab';
            newE.id = element.id;
            var bg =
                element.colorType == 1
                    ? `background: -webkit-linear-gradient(${element.multiColor.pos}, ${element.multiColor.color1}, ${element.multiColor.color2}, ${element.multiColor.color3}, ${element.multiColor.color4});
            -webkit-background-clip: text;`
                    : `background: ${element.backgroundColor}`;

            newE.setAttribute(
                'style',
                `font-size: ${element.fontSize}px; font-weight: ${element.bold};font-style: ${element.italic};font-family: ${element.fontFamily};color: ${element.color}; ${bg}; top: ${element.y}px;left: ${element.x}px;
                padding:${element.padding}px; border-radius: ${element.borderRadius}px;
                border: ${element.border.width}px solid ${element.border.color}
                `
            );
            newE.setAttribute('data-type-color', element.colorType);
            if (element.colorType == 0) {
                newE.innerHTML = element.text;
            } else if (element.colorType == 1) {
                // linear color
                newE.classList.add('linear-gradient');
                newE.innerHTML = element.text;
                newE.setAttribute(
                    'data-color',
                    element.multiColor.color1 +
                        ',' +
                        element.multiColor.color2 +
                        ',' +
                        element.multiColor.color3 +
                        ',' +
                        element.multiColor.color4
                );
                newE.setAttribute('data-pos', element.multiColor.pos);
            } else if (element.colorType == 2) {
                var tmp = element.text;
                newE.innerHTML = randomColorColorText(tmp);
            }
            mouseClickText(newE);
            dragElement(newE);
            document.querySelector('.text-container').appendChild(newE);
        }
    }
}

function xoaBtn(id) {
    id = id || document.querySelector('.edit-container').id;
    x = confirm('Vui lòng xác nhận xóa');
    if (!x) return;
    var arrText = JSON.parse(localStorage.getItem('Text')) || [];
    for (let i = 0; i < arrText.length; i++) {
        const element = arrText[i];
        if (element.id == id) {
            arrText.splice(i, 1);
            // a.splice
            localStorage.setItem('Text', JSON.stringify(arrText));
            showMessage('Thành công', 'Đã xóa, Cập nhật dữ liệu thành công! Đã áp dụng');
            viewBlock(0);
            loadText();
            return;
        }
    }
    showMessage('Hủy', 'Bạn đã hủy thao tác!');
    viewBlock(0);
    loadText();
}
function xoaBtn2(id) {
    var arrText = JSON.parse(localStorage.getItem('Text')) || [];
    for (let i = 0; i < arrText.length; i++) {
        const element = arrText[i];
        if (element.id == id) {
            var x = confirm('Xác nhận xóa: ' + element.text);
            if (!x) return;
            arrText.splice(i, 1);
            localStorage.setItem('Text', JSON.stringify(arrText));
            getListText();
            showMessage('Thành công', 'Đã xóa, Cập nhật dữ liệu thành công!');
        }
    }
}

function setNewPosition(id, x, y) {
    var a = JSON.parse(localStorage.getItem('Text')) || [];
    a.forEach((element) => {
        if (element.id == id) {
            element.x = x;
            element.y = y;
            localStorage.setItem('Text', JSON.stringify(a));
        }
    });
}

function remoteEditText(id) {
    viewBlock(1);
    var a = JSON.parse(localStorage.getItem('Text')) || [];
    var element;
    a.forEach((x) => {
        if (x.id == id) {
            element = x;
        }
    });
    if (element) {
        var text = element.text || 'Chưa nhập gì',
            color = element.color || '#ffffff',
            fontFamily = element.fontFamily.replace(/\"/g, ''),
            fontSize = element.fontSize,
            backgroundColor = element.backgroundColor || 'rgba(255,255,255,0)',
            status = element.status,
            bold = element.bold,
            padding = element.padding;
        (italic = element.fontStyle),
            (x = element.x),
            (y = element.y),
            (colorType = element.colorType),
            (borderRadius = element.borderRadius),
            (border = {
                width: element.border.width,
                color: element.border.color,
            });
        multiColor = {};
        if (element.colorType == 0) changeTypeColor(0);
        else if (element.colorType == 1) {
            multiColor.color1 = element.multiColor.color1;
            multiColor.color2 = element.multiColor.color2;
            multiColor.color3 = element.multiColor.color3;
            multiColor.color4 = element.multiColor.color4;
            multiColor.pos = element.multiColor.pos;
            document.querySelector('.tab .tab-2 select').value = 1;
            document.querySelector('.tab .tab-2 .multi select').value = 1;
            document.querySelector('.tab .tab-2 .multi .multi-select select').value =
                multiColor.pos;
            changeTypeColor(1);
        } else if (element.colorType == 2) {
            document.querySelector('.tab .tab-2 select').value = 1;

            document.querySelector('.tab .tab-2 .multi select').value = 2;
            changeTypeColor(2);
        }

        var options = {
            text: text,
            borderRadius: borderRadius,
            color: color,
            fontFamily: fontFamily,
            fontSize: fontSize,
            backgroundColor: backgroundColor,
            x: x,
            y: y,
            status: status,
            bold: bold,
            italic: italic,
            colorType: colorType,
            multiColor: multiColor,
            padding: padding,
            border: border,
            time: {
                createdAt: element.time.createdAt || getToday(),
                updatedAt: element.time.updatedAt || getToday(),
            },
        };
        textDemo = new Text(id, options);
    } else textDemo = new Text();

    //Todo set Value // dữ liệu ở chỗ chỉnh sửa
    document.querySelector('.main .edit-container').id = textDemo.id;
    document.getElementById('text-input').value = textDemo.text;
    document.getElementById('size-input').value = parseInt(textDemo.fontSize);
    if (textDemo.bold == 'bold') document.getElementById('bold').selected;
    if (textDemo.italic == 'italic') document.getElementById('i').selected;
    document.querySelector('.content .content-2 .tab-4 .x-input').value = textDemo.x;
    document.querySelector('.content .content-2 .tab-4 .y-input').value = textDemo.y;
    document.querySelector('.content .content-2 .color-input').value = textDemo.color;

    document.querySelector('.content .content-2 .font-input').value = textDemo.fontFamily;
    document.querySelector('.content .content-2 .tab-3 .padding-input').value = parseInt(
        textDemo.padding
    );
    document.querySelector('.content .content-2 .tab-3 .radius-input').value = parseInt(
        textDemo.borderRadius
    );
    document.querySelector('.tab .tab-3 .border-width-input').value = textDemo.border.width;
    document.querySelector('.tab .tab-3 .border-color-input').value = textDemo.border.color;

    callFunctionEdits();
}
function callFunctionEdits() {
    changeBorderColorText();
    changeBorderWidthText();
    getColorOfBackgroundPadding();
    changeColorBackgroundText();
    changePaddingBackgroundText();
    changeBorderRadiusBackgroundText();
    onchangeValueTab1();
    setStyleTextDemo();
    changeTab(0);
}
//Todo ẩn hoặc hiển ở menu chỉnh sửa
function statusBtn(e) {
    var element = e.target;
    if (textDemo.status == 1) {
        element.value = 'Hiện thị';
        textDemo.status = 0;
    } else {
        element.value = 'Ẩn';
        textDemo.status = 1;
    }
}
//Todo xóa "Text" ở màn hình chính
function deleteTextBtn(id) {
    var a = JSON.parse(localStorage.getItem('Text')) || [];
    for (let i = 0; i < a.length; i++) {
        if (a[i].id == id) {
            var x = confirm('Xác nhận xóa : ' + a[i].text);
            if (x) {
                a.splice(i, 1);
                showMessage('Thành công', 'Đã xác nhận xóa, Load lại dữ liệu');
            }
        }
    }
    localStorage.setItem('Text', JSON.stringify(a));
    loadText();
}
//Todo ẩn "Text" ở màn hình chính
function statusBtn2(id) {
    var a = JSON.parse(localStorage.getItem('Text')) || [];
    for (let i = 0; i < a.length; i++) {
        if (a[i].id == id) {
            a[i].status = 0;
        }
    }
    localStorage.setItem('Text', JSON.stringify(a));
    loadText();
}

function getListText() {
    viewBlock(2);
    var array = JSON.parse(localStorage.getItem('Text')) || [];
    var container = document.querySelector('.list-skin .container');
    container.innerHTML = '';
    for (let i = 0; i < array.length; i++) {
        const element = array[i];

        var eye =
            element.status == 1
                ? `<i class="fa-sharp fa-solid fa-eye"></i>`
                : `<i class="fa-sharp fa-solid fa-eye-slash" ></i>`;
        var eyeText = element.status == 0 ? `Ấn để hiện` : `Ấn để ẩn`;
        var elmnt = document.createElement('div');
        elmnt.classList = 'element';
        elmnt.innerHTML = `
         <div class="start">
             <div class="name" onclick="remoteEditText('${element.id}')">${element.text}</div>
             <div class="time">
                 <div>
                     <div class="created-at">
                         <span>Ngày tạo: </span>
                         <span>${element.time.createdAt}</span>
                     </div>
                     <div class="updated-at">
                         <span>Ngày sửa: </span>
                         <span>${element.time.updatedAt}</span>
                     </div>
                 </div>
             </div>
         </div>
         <div class="end">
             <div class="group-btn">
                 <div class="tooltip" data-tooltip="Chỉnh sửa">
                     <i class="fa-solid fa-pen-to-square" onclick="remoteEditText('${element.id}')"></i>
                 </div>
                 <div class="tooltip" data-tooltip="${eyeText}" onclick="hideText2('${element.id}')">${eye}</div>
                 <div class="tooltip" data-tooltip="Xóa" onclick="xoaBtn2('${element.id}')">
                     <i class="fa-solid fa-trash"></i>
                 </div>
             </div>
         </div>
     </div>`;
        container.appendChild(elmnt);
    }
}

function viewBlock(n) {
    var arrBlock = [];
    var textContent = document.querySelector('.text-container'); // 0
    var editContainer = document.querySelector('.edit-container'); //1
    var listSkin = document.querySelector('.list-skin'); //2
    arrBlock.push(textContent);
    arrBlock.push(editContainer);
    arrBlock.push(listSkin);

    arrBlock.forEach((element) => {
        element.style.display = 'none';
    });
    arrBlock[n].style.display = 'block';
    if (n == 0) {
        mouseClickText('background');
        loadText();
    }
}

function hideText2(id) {
    var a = JSON.parse(localStorage.getItem('Text')) || [];
    for (let i = 0; i < a.length; i++) {
        if (a[i].id == id) {
            if (a[i].status == 1) {
                a[i].status = 0;
                localStorage.setItem('Text', JSON.stringify(a));
                showMessage('Thành công', 'Đã ẩn khỏi màn hình');
            } else {
                a[i].status = 1;
                localStorage.setItem('Text', JSON.stringify(a));
                showMessage('Thành công', 'Đã hiển thị trên màn hình');
            }
            getListText();
        }
    }
}
function changeColorBackgroundText() {
    var color = document.querySelector('.tab .tab-3 .color-input').value;
    color = color.replace('#', '');
    var rgb = hexToRgb(color);
    var a = document.querySelector('.tab .tab-3 .opacity-input').value;
    var alfa = (a / 100).toFixed(2);

    var rgba = `rgba(${rgb.r},${rgb.g},${rgb.b},${alfa})`;
    textDemo.backgroundColor = rgba;
    setStyleTextDemo();
}

function randomColorBackgroundText() {
    var color = randomColor();
    document.querySelector('.tab .tab-3 .color-input').value = color;
    changeColorBackgroundText();
}
function changeOpacityBackgroundText() {
    changeColorBackgroundText();
    var a = document.querySelector('.tab .tab-3 .opacity-input').value;
    var alfa = ((a / 100) * 100).toFixed(0);
    document.querySelector('.tab .tab-3 .present-output').innerHTML = alfa + '%';
}

function changePaddingBackgroundText() {
    var padding = document.querySelector('.tab .tab-3 .padding-input').value;
    textDemo.padding = padding;
    document.querySelector('.tab .tab-3 .present-output-2').innerHTML = padding + 'px';
    setStyleTextDemo();
}
function changeBorderRadiusBackgroundText() {
    var radius = document.querySelector('.tab .tab-3 .radius-input').value;
    textDemo.borderRadius = radius;
    document.querySelector('.tab .tab-3 .present-output-3').innerHTML = radius + 'px';
    setStyleTextDemo();
}

function getColorOfBackgroundPadding() {
    var bg = textDemo.backgroundColor;
    var tmp = bg.replace(/(\(|\)|rgba|\s)/g, '').split(',');
    var color = rgbToHex(tmp[0], tmp[1], tmp[2]);
    var alfa = tmp[3];
    //opacity-input
    document.querySelector('.tab .tab-3 .opacity-input').value = alfa * 100;
    document.querySelector('.tab .tab-3 .present-output').innerHTML = alfa * 100 + '%';
    document.querySelector('.tab .tab-3 .color-input').value = color;
}
function hideTextAll() {
    var a = JSON.parse(localStorage.getItem('Text')) || [];
    for (let i = 0; i < a.length; i++) a[i].status = 0;
    localStorage.setItem('Text', JSON.stringify(a));
    loadText();
}
function displayTextAll() {
    var a = JSON.parse(localStorage.getItem('Text')) || [];
    for (let i = 0; i < a.length; i++) a[i].status = 1;
    localStorage.setItem('Text', JSON.stringify(a));
    loadText();
}

function changeBorderColorText() {
    textDemo.border.color = document.querySelector('.tab .tab-3 .border-color-input').value;
    setStyleTextDemo();
}
function changeBorderColorTextRandomBtn() {
    var color = randomColor();
    textDemo.border.color = color;
    document.querySelector('.tab .tab-3 .border-color-input').value = color;
    setStyleTextDemo();
}
function changeBorderWidthText() {
    textDemo.border.width = document.querySelector('.tab .tab-3 .border-width-input').value;
    document.querySelector('.tab .tab-3 .present-output-4').innerHTML =
        textDemo.border.width + 'px';
    setStyleTextDemo();
}
