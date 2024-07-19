
// стартовые параметры формы
const initColorSheme =  'w2g-dark'; //'twilight';
const autoUpdatingEnabled = false;
const setDefaultPositionOnResize = true;

const topDataPath = './curgame';
//const topDataPath = 'http://x96101uy.beget.tech/qclp/data';

var topData = {};

// Основной объект формы, содержит настройки и функцию смены цветовой схемы
// поля, содержащие ссылки на элементы формы, добавляются в initTopWindow()
var topWindow = {
    colorScheme: initColorSheme,
    autoUpdating: autoUpdatingEnabled,
    setDefaultPositionOnResize: setDefaultPositionOnResize,

    addLogMessage : function (lMessage) {
        this.messagesTextarea.value = "[" + getTimeNow() + "] " + lMessage + "\r" + this.messagesTextarea.value;
        let bottomMessageBlock = document.querySelector("#client-bottom-block-last-message");
        if (bottomMessageBlock) bottomMessageBlock.innerHTML = lMessage;
    },
    changeColorScheme : function (cShemeName) {

        if (cShemeName == 'twilight') {
            this.colorScheme = 'twilight';
            topWindow.colorShemeSelect.value = this.colorScheme;   

            let element = document.querySelector('body');
                element.style.backgroundColor = '#112';
                
            element = document.querySelector('#client-container');
                element.style.backgroundColor = '#335';
                element.style.color = '#DDF';

            element = document.querySelector('#client-extra-button');
                element.style.backgroundColor = '#232342';

            element = document.querySelector('#client-extra-textarea-messages');
                element.style.backgroundColor = '#122332';
                element.style.color = '#DDF';

            element = document.querySelector('#client-select-colorSheme');
                element.style.backgroundColor = '#122332';
                element.style.color = '#DDF';

            element = document.querySelector('#client-extra-panel');
                element.style.backgroundColor = '#335';                

            element = document.querySelector('#client-top-header');
                element.style.backgroundColor = '#232342';
                element.style.borderBottom = '1px solid #224';

            element = document.querySelector('#client-update-progress-bar');
                element.style.backgroundColor = '#2d3d63';

            element = document.querySelector('#update-data-button');
                element.style.backgroundColor = '#335';   

            element = document.querySelector('#client-bottom-block');
                element.style.backgroundColor = '#232342';
                element.style.borderBottom = '1px solid #224';                

            element = document.querySelectorAll('.client-top-string').forEach(e => e.style.backgroundColor = '#557');    
        }

        if (cShemeName == 'light') {
            this.colorScheme = 'light';
            topWindow.colorShemeSelect.value = this.colorScheme;   

            let element = document.querySelector('body');
                element.style.backgroundColor = '#FFFDFF';                

            element = document.querySelector('#client-container');
                element.style.backgroundColor = '#edf5ed';
                element.style.color = '#635';

            element = document.querySelector('#client-extra-button');
                element.style.backgroundColor = '#ffebe1';
             element = document.querySelector('#client-extra-panel');
                element.style.backgroundColor = '#ffebe1';

            element = document.querySelector('#client-extra-panel');
                element.style.backgroundColor = '#edf5ed';

            element = document.querySelector('#client-extra-textarea-messages');
                element.style.backgroundColor = '#FFFDFF';
                element.style.color = '#635';

            element = document.querySelector('#client-select-colorSheme');
                element.style.backgroundColor = '#FFFDFF'; 
                element.style.color = '#635';

            element = document.querySelector('#client-top-header');
                element.style.backgroundColor = '#ffebe1';
                element.style.borderBottom = '1px solid #CCA';

            element = document.querySelector('#client-update-progress-bar');
                element.style.backgroundColor = '#CdBdA3';

            element = document.querySelector('#update-data-button');
                element.style.backgroundColor = '#edf5ed';                

            element = document.querySelector('#client-bottom-block');
                element.style.backgroundColor = '#ffebe1';
                element.style.borderBottom = '1px solid #CCA';   

            element = document.querySelectorAll('.client-top-string').forEach(e => {
                e.style.backgroundColor = '#FAFAD5';  
            });
                
        }

        if (cShemeName == 'w2g-dark') {
            this.colorScheme = 'w2g-dark';
            topWindow.colorShemeSelect.value = this.colorScheme;       

            let element = document.querySelector('body');
                element.style.backgroundColor = '#112';
                
            element = document.querySelector('#client-container');
                element.style.backgroundColor = '#3a4759';
                element.style.color = '#DDF';

            element = document.querySelector('#client-extra-button');
                element.style.backgroundColor = '#283240';

            element = document.querySelector('#client-extra-panel');
                element.style.backgroundColor = '#303d51';

            element = document.querySelector('#client-extra-textarea-messages');
                element.style.backgroundColor = '#283240';
                element.style.color = '#DDF';

            element = document.querySelector('#client-select-colorSheme');
                element.style.backgroundColor = '#283240';  
                element.style.color = '#DDF';           

            element = document.querySelector('#client-top-header');
                element.style.backgroundColor = '#283240';
                element.style.borderBottom = '1px solid #224';

            element = document.querySelector('#client-update-progress-bar');
                element.style.backgroundColor = '#2d3d63';

            element = document.querySelector('#update-data-button');
                element.style.backgroundColor = '#293446';   

            element = document.querySelector('#client-bottom-block');
                element.style.backgroundColor = '#283240';
                element.style.borderBottom = '1px solid #224';                

            element = document.querySelectorAll('.client-top-string').forEach(e => e.style.backgroundColor = '#557');   
        }
    }
};


// Объект для контроля обновлений
var updater = {
    delay: 15000,
    tick: 32,
    counter: 1000,
    check: function () {
        if (this.counter > 0) { 
            this.counter -= this.tick;
        } else { 
            loadTopData(topDataPath);
            this.counter = this.delay;
            topWindow.uBlock.style.width = '0%';
        }
        
        if (this.counter === 0) { topWindow.uBlock.style.width ='0%'; }
        else {
            topWindow.uBlock.style.width = 100 - (100 * (this.counter/this.delay)) + '%';
        }

        if (topWindow.autoUpdating) setTimeout(()=>{updater.check();}, this.tick);
    }
};


// Получаем время в формате "24:60:60"
var getTimeNow = function () {
    var dNow = new Date();
    
    let tnHours = dNow.getHours().toString();
    if (tnHours.length < 2) { tnHours = '0'+tnHours; }
    let tnMinutes = dNow.getMinutes().toString();
    if (tnMinutes.length < 2) { tnMinutes = '0'+tnMinutes; }
    let tnSeconds = dNow.getSeconds().toString();
    if (tnSeconds.length < 2) { tnSeconds = '0'+tnSeconds; }
            
    return tnHours + ":" + tnMinutes + ":" + tnSeconds;
};


// ====================== НАЧАЛО initTopWindow =========================
// ========= Инициализируем (встраиваем) основную форму топа ===========
var initTopWindow = function () {
    var hBlock = document.querySelector('head');
    var bBlock = document.querySelector('body');
    
    topWindow.cBlock = document.createElement('div');
    topWindow.cBlock.id = 'client-container';
    topWindow.cBlock.innerHTML = 
        "<div id='client-extra-button'>"
            +"<div id='client-extra-button-text'><</div>"                
        +"</div>";

    topWindow.extraPanel = document.createElement('div');
    topWindow.extraPanel.id = 'client-extra-panel';
    topWindow.cBlock.appendChild(topWindow.extraPanel);

    topWindow.autoUpdateCheckbox = document.createElement('input');
    topWindow.autoUpdateCheckbox.id = 'client-auto-update-checkbox';
    topWindow.autoUpdateCheckbox.type = 'checkbox';
    topWindow.autoUpdateCheckbox.checked = topWindow.autoUpdating;
    topWindow.autoUpdateCheckbox.addEventListener('change', () => {
        if (topWindow.autoUpdateCheckbox.checked) {
            topWindow.autoUpdating = true;
            topWindow.addLogMessage("автообн. запущено");
            updater.check();
        } else {
            topWindow.autoUpdating = false;
            topWindow.addLogMessage("автообн. остановлено");
        }
    });
    var AUcheckboxContainer = document.createElement('div');
    AUcheckboxContainer.id = "autoUpdateCheckboxContainer";
    AUcheckboxContainer.innerHTML += "AU&nbsp ";
    AUcheckboxContainer.style.display = "inline-block";
    AUcheckboxContainer.appendChild(topWindow.autoUpdateCheckbox);
    topWindow.extraPanel.appendChild(AUcheckboxContainer);  

    topWindow.colorShemeSelect = document.createElement('select');
    topWindow.colorShemeSelect.id = 'client-select-colorSheme';
    topWindow.colorShemeSelect.value = initColorSheme;
    topWindow.colorShemeSelect.setAttribute("list","colorSchemes");
    topWindow.colorShemeSelect.innerHTML = 
        "<datalist id='colorSchemes'>"
            +"<option value='twilight'>Twilight</option>"
            +"<option value='w2g-dark'>W2G-Dark</option>"
            +"<option value='light'>Light</option>"
        +"</datalist>";
    topWindow.colorShemeSelect.addEventListener('change', () => {
        topWindow.changeColorScheme(topWindow.colorShemeSelect.value);
    });
    topWindow.extraPanel.appendChild(topWindow.colorShemeSelect);   

    topWindow.bottomPanelCheckbox = document.createElement('input');
    topWindow.bottomPanelCheckbox.id = 'client-show-bottom-panel-checkbox';
    topWindow.bottomPanelCheckbox.type = 'checkbox';
    topWindow.bottomPanelCheckbox.checked = true;
    topWindow.bottomPanelCheckbox.addEventListener('change', () => {
        if (topWindow.bottomPanelCheckbox.checked) {            
            topWindow.bottomBlock.style.display = "flex";
        } else {
            topWindow.bottomBlock.style.display = "none";
        }
    });
    var BPcheckboxContainer = document.createElement('div');
    BPcheckboxContainer.id = "bottomPanelCheckboxContainer";
    BPcheckboxContainer.style.display = "inline-block";    
    BPcheckboxContainer.innerHTML += "  &nbspBP";
    BPcheckboxContainer.prepend(topWindow.bottomPanelCheckbox);
    topWindow.extraPanel.appendChild(BPcheckboxContainer);   

    topWindow.messagesTextarea = document.createElement('textarea');
    topWindow.messagesTextarea.id = 'client-extra-textarea-messages';
    topWindow.messagesTextarea.readOnly = true;
    topWindow.extraPanel.appendChild(topWindow.messagesTextarea);      

    bBlock.appendChild(topWindow.cBlock);
    topWindow.eBtnText = document.querySelector('#client-extra-button-text');

    topWindow.eBlockBtn = document.querySelector('#client-extra-button').addEventListener('click', (eBtn) => { 
        topWindow.ePanel = document.querySelector('#client-extra-panel');
        if (topWindow.ePanel.style.display == 'none') { 
            topWindow.ePanel.style.display = 'block';
            
            topWindow.eBtnText.innerHTML = '>';
        } else {
            topWindow.ePanel.style.display = 'none';
            topWindow.eBtnText.innerHTML = '<';
        }
    });

    topWindow.headerBlock = document.createElement('div');
    topWindow.headerBlock.id = 'client-top-header';
    topWindow.headerBlock.innerHTML =
        "<div id='client-top-header-game-date'>32.13.46</div>"
        +"<div id='client-top-header-caption'>[Название]</div>"
        +"<button id='update-data-button'>&#x27F3;</button>";
    topWindow.cBlock.appendChild(topWindow.headerBlock);

    topWindow.topBlock = document.createElement('div');
        topWindow.topBlock.id = 'client-top-table';
        topWindow.topBlock.innerHTML = '<a style="margin-top: 15px; font-weight: 700; font-size: 24px"> ТОП </a>';
        topWindow.cBlock.appendChild(topWindow.topBlock);

    topWindow.updateBlock = document.createElement('div');
    topWindow.updateBlock.innerHTML = 
        "<div id='client-bottom-update'>"
            +"<div id='client-update-progress-bar'></div>"
        +"</div>";
    topWindow.cBlock.appendChild(topWindow.updateBlock);

    topWindow.bottomBlock = document.createElement('div');
    topWindow.bottomBlock.id = 'client-bottom-block';
    topWindow.bottomBlock.innerHTML =
        "<div id='client-bottom-block-update-time'>00.00.00</div>"
        +"<div id='client-bottom-block-last-message'></div>"  
        +"<div id='client-bottom-block-video-adress'>yt~dsfg4DF</div>";
    topWindow.cBlock.appendChild(topWindow.bottomBlock);

    topWindow.uBlock = document.querySelector('#client-update-progress-bar');

    topWindow.w2gRightBlock = document.querySelector("#w2g-at-right");

    document.querySelector('#client-bottom-block-update-time').innerHTML = '00:00:00';
    
    document.querySelector('#update-data-button').addEventListener('click', () => {
        loadTopData(topDataPath);
        
        updater.counter = updater.delay;
        
    });
    
    topWindow.changeColorScheme(topWindow.colorScheme);
            
    makeDraggable(topWindow.cBlock);

    topWindow.setDefaultPositionOnResize = setDefaultPositionOnResize;
    topWindow.setDefaultPosition();

    topWindow.addLogMessage("окно инициализировано");
    
    if (topWindow.autoUpdating) {
        updater.check();
        topWindow.addLogMessage("автообн. запущено");
    }
};
// ====================================================================
// ====================== КОНЕЦ initTopWindow ==========================


// Сокрашаем полный адрес ютуб-видео до "yt~XXXXXXXX"
var getShortYTAdress = function(adress) {
    let shortAdress = adress;
    if (adress.search('youtube')>0) {
        shortAdress = "yt~"+adress.split("?v=")[1];
    }

    return shortAdress;
}


// Импортируем полученные данные 
var importData = function (tData) {
    console.log('import start');
    var parsedData = JSON.parse(decodeURIComponent(escape(atob(tData))));
    
    if (!parsedData.name) {
        console.log('importing string not valid');
    } else { 
        console.log(parsedData);
        topData = parsedData;

        updateTopTable();
    }
};


// Подгружаем с сервера свежие данные
var loadTopData = function (tdPath) {
    var XHR = new XMLHttpRequest();
    XHR.open('GET', tdPath);
    XHR.setRequestHeader('Cache-Control', 'no-cache, no-store, max-age=8');
    XHR.onreadystatechange = function() { 
        if (XHR.readyState === XMLHttpRequest.DONE) { 
            let rText = XHR.responseText;
            rText = JSON.parse(decodeURIComponent(escape(atob(rText))));

            topData = rText;

            if (!topData.players) { 
                 topWindow.addLogMessage("неверные данные");
                return;
            }

            updateTopTable();
            
            var dNow = new Date();
            let tnHours = dNow.getHours().toString();
            if (tnHours.length < 2) { tnHours = '0'+tnHours; }
            let tnMinutes = dNow.getMinutes().toString();
            if (tnMinutes.length < 2) { tnMinutes = '0'+tnMinutes; }
            let tnSeconds = dNow.getSeconds().toString();
            if (tnSeconds.length < 2) { tnSeconds = '0'+tnSeconds; }
            
            var tNow = getTimeNow();
            document.querySelector('#client-bottom-block-update-time').innerHTML = tNow;            
            document.querySelector('#client-top-header-caption').innerHTML = topData.name;
            document.querySelector('#client-bottom-block-last-message').innerHTML = 'обновлено успешно';
            document.querySelector('#client-top-header-game-date').innerHTML = topData.date;
            document.querySelector('#client-bottom-block-video-adress').innerHTML = getShortYTAdress(topData.videoAdress);

            topWindow.changeColorScheme(topWindow.colorScheme);

            if (topData.stopped) {
                if (topData.stopped == true) {
                    topWindow.autoUpdating = false;
                    topWindow.autoUpdateCheckbox.checked = false;
                    topWindow.addLogMessage("остановлено хостом");
                } else topWindow.addLogMessage("счёт обновлен");
            } else topWindow.addLogMessage("счёт обновлен");
        }
    };
    XHR.send();
};


// Перестраиваем таблицу топа с актуальной информацией
var updateTopTable = function()  {
    const sortFn = (a, b) => {
        if (a.points < b.points) { return 1; 
        } else if (a.points > b.points) { return -1; }
            return 0; 
    };

    topData.players.sort(sortFn);

    topTable = document.querySelector("#client-top-table");
    topTable.innerHTML = "";

    var placeN = 1;
    for (let i = 0; i < topData.players.length; i++) { 

        pString = "&nbsp&nbsp"+placeN + "&nbsp";
        if (placeN == 1) { pString = "&#127942"; }
        if (placeN == 2) { pString = "&#129352"; }
        if (placeN == 3) { pString = "&#129353"; }

        topTable.innerHTML += 
            "<div class='client-top-string' id='top"+placeN+"-player'>"
                +"<div class='client-top-string-place' id='top"+placeN+"-player-place'>"+pString+"</div>"
                +"<div class='client-top-string-names' id='top"+placeN+"-player-names'></div>"
                +"<div class='client-top-string-score' id='top"+placeN+"-score'></div>"
            +"</div><br>";
        tpNameElement  = document.querySelector("#top"+placeN+"-player-names");
        tpScoreElement = document.querySelector("#top"+placeN+"-score");
        
        tpNameElement.innerHTML  = topData.players[i].name;
        tpScoreElement.innerHTML = topData.players[i].points;

        for (let j = i+1; j < topData.players.length; j++) { 
            if (topData.players[j].points >= topData.players[i].points) {
                tpNameElement.innerHTML += "  " + topData.players[j].name;
                i = i+1;                
            }
        }
        placeN += 1;
    }

    if (document.URL.search("w2g.tv")>0) {
        topWindow.curColorSchemeName = 'w2g-dark'; 
    }

    topWindow.changeColorScheme(topWindow.curColorSchemeName);
};


function makeDraggable (element) {
    // Make an element draggable (or if it has a .window-top class, drag based on the .window-top element)
    let currentPosX = 0, currentPosY = 0, previousPosX = 0, previousPosY = 0;

        // If there is a window-top classed element, attach to that element instead of full window
    if (element.querySelector('#client-top-header')) {
        // If present, the window-top element is where you move the parent element from
        element.querySelector('#client-top-header').onmousedown = dragMouseDown;
    } 
    else {
        // Otherwise, move the element itself
        element.onmousedown = dragMouseDown;
    }

    function dragMouseDown (e) {
        // Prevent any default action on this element (you can remove if you need this element to perform its default action)
        e.preventDefault();
        // Get the mouse cursor position and set the initial previous positions to begin
        previousPosX = e.clientX;
        previousPosY = e.clientY;
        // When the mouse is let go, call the closing event
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves
        document.onmousemove = elementDrag;
    }

    function elementDrag (e) {
        // Prevent any default action on this element (you can remove if you need this element to perform its default action)
        e.preventDefault();
        // Calculate the new cursor position by using the previous x and y positions of the mouse
        currentPosX = previousPosX - e.clientX;
        currentPosY = previousPosY - e.clientY;
        // Replace the previous positions with the new x and y positions of the mouse
        previousPosX = e.clientX;
        previousPosY = e.clientY;
        // Set the element's new position
        element.style.top = (element.offsetTop - currentPosY) + 'px';
        element.style.left = (element.offsetLeft - currentPosX) + 'px';
    }

    function closeDragElement () {
        // Stop moving when mouse button is released and release events
        document.onmouseup = null;
        document.onmousemove = null;
    }
}


// Выравниваем форму по центру, либо по блоку w2g-at-right, если он есть
topWindow.setDefaultPosition = function() {
    if (topWindow.setDefaultPositionOnResize) {    
        if (topWindow.w2gRightBlock != null) {
            let bClientRect = topWindow.w2gRightBlock.getBoundingClientRect();
            topWindow.cBlock.style.left = (6+bClientRect.left).toString()+'px';
            topWindow.cBlock.style.top  = (6+bClientRect.top).toString()+'px';
        } else { 
            topWindow.cBlock.style.left = (window.innerWidth/2 - topWindow.cBlock.offsetWidth/2) + 'px';
            topWindow.cBlock.style.top = (window.innerHeight/2 - topWindow.cBlock.offsetHeight/2) + 'px';
        }
    }
}


window.addEventListener('load', () => {
    // Запускаем ету шарманку
    initTopWindow();   
});


// Выравниваем форму по центру при ресайзе окна браузера
window.addEventListener('resize', () => {
    topWindow.setDefaultPosition();
});