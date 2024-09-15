
// стартовые параметры формы
const defaultColorScheme = 'w2g-dark';
const autoUpdatingEnabled = false;
const setDefaultPositionOnResize = true;

//const defaultHostAdress = 'http://localhost:8080/pQuiz';
const defaultHostAdress = 'https://quiz.scuf.ru';
//const defaultHostAdress = 'http://x96101uy.beget.tech/qclp';

    
var topData = {};

// Основной объект формы, содержит настройки и функцию смены цветовой схемы
// поля, содержащие ссылки на элементы формы, добавляются в initTopWindow()
var topWindow = {
    colorScheme: {name:defaultColorScheme},
    autoUpdating: autoUpdatingEnabled,
    setDefaultPositionOnResize: setDefaultPositionOnResize,
    
    player : {nick:"player", uuid:""},

    addLogMessage : function (lMessage) {
        this.messagesTextarea.value = "[" + getTimeNow() + "] " + lMessage + "\r" + this.messagesTextarea.value;
        let bottomMessageBlock = document.querySelector("#client-bottom-panel-last-message");
        if (bottomMessageBlock) bottomMessageBlock.innerHTML = lMessage;
    },
    
    changeColorScheme : function (cSchemeName) {
        function performChange() { 
            let element = document.querySelector('body');
                element.style.backgroundColor = topWindow.colorScheme.bgColor;
                
            element = document.querySelector('#client-container');
                element.style.backgroundColor = topWindow.colorScheme.blockColor;
                element.style.color = topWindow.colorScheme.textColor;

            element = document.querySelector('#client-extra-button');
                element.style.backgroundColor = topWindow.colorScheme.headerColor;

            element = document.querySelector('#client-extra-textarea-messages');
                element.style.backgroundColor = topWindow.colorScheme.detailsColor;
                element.style.color = topWindow.colorScheme.textColor;

            element = document.querySelector('#client-extra-panel');
                element.style.backgroundColor = topWindow.colorScheme.blockColor;                

            element = document.querySelector('#client-top-header');
                element.style.backgroundColor = topWindow.colorScheme.headerColor;
                element.style.borderBottom = '1px solid '+topWindow.colorScheme.headerColor;

            element = document.querySelector('#client-update-progress-bar');
                element.style.backgroundColor = topWindow.colorScheme.listAccentColor;

            element = document.querySelector('#update-data-button');
                element.style.backgroundColor = topWindow.colorScheme.blockColor;   

            element = document.querySelector('#client-bottom-block');
                element.style.backgroundColor = topWindow.colorScheme.headerColor;
                element.style.borderBottom = '1px solid '+topWindow.colorScheme.headerColor;                

            document.querySelectorAll('.client-top-string').forEach(
            e => e.style.backgroundColor = topWindow.colorScheme.listAccentColor);  

            document.querySelectorAll('.pquiz-select').forEach(
            e => {
                e.style.backgroundColor = topWindow.colorScheme.detailsColor;
                e.style.color = topWindow.colorScheme.textColor;
                
            });  
            document.querySelectorAll('.pquiz-checkbox-container').forEach(
            e => {
                e.style.backgroundColor = topWindow.colorScheme.detailsColor;
                e.style.color = topWindow.colorScheme.textColor;                    
            });  
            document.querySelectorAll('input').forEach(
            e => {
                e.style.backgroundColor = topWindow.colorScheme.listAccentColor;
                e.style.color = topWindow.colorScheme.textColor;                    
            });  
            document.querySelectorAll('button').forEach(
            e => {
                e.style.backgroundColor = topWindow.colorScheme.listAccentColor;
                e.style.color = topWindow.colorScheme.textColor;
                
            }); 
            document.querySelectorAll('textarea').forEach(
            e => {
                e.style.backgroundColor = topWindow.colorScheme.listAccentColor;
                e.style.color = topWindow.colorScheme.textColor;
                
            }); 
            
            updateAnswerBtns(topWindow.curAnswerMode);
        }

        if (!topWindow.colorScheme) topWindow.colorScheme = {};

        if (cSchemeName == "w2g-dark") {
            topWindow.colorScheme.name = "w2g-dark";

            topWindow.colorScheme.bgColor = '#112';
            topWindow.colorScheme.blockColor = '#3a4759';
            topWindow.colorScheme.headerColor = '#283240';
            topWindow.colorScheme.textColor = '#DDF';
            topWindow.colorScheme.detailsColor = '#303d51';
            topWindow.colorScheme.listAccentColor = "#557";

            performChange();
        }

        if (cSchemeName == "twilight") {
            topWindow.colorScheme.name = "twilight";

            topWindow.colorScheme.bgColor = '#112';
            topWindow.colorScheme.textColor = '#DDF';
            topWindow.colorScheme.blockColor = '#282852';
            topWindow.colorScheme.headerColor = '#224';
            topWindow.colorScheme.detailsColor = '#362862';
            topWindow.colorScheme.listAccentColor = "#423264";

            performChange();
        }

        if (cSchemeName == "light") {
            topWindow.colorScheme.name = "light";

            topWindow.colorScheme.bgColor = '#FFFDFF';
            topWindow.colorScheme.blockColor = '#edf5ed';
            topWindow.colorScheme.headerColor = '#ffebe1';
            topWindow.colorScheme.textColor = '#993';
            topWindow.colorScheme.detailsColor = '#ffffdf';
            topWindow.colorScheme.listAccentColor = '#FAFAD5';     

            performChange();     
        }
    }
};


// Объект для контроля обновлений
var gameStateUpdater = {
    delay : 15000,
    tick : 100,
    counter : 1000,
    check : function () {
        if (this.counter > 0) { 
            this.counter -= this.tick;
        } else { 
            loadTopData();
            this.counter = this.delay;
            topWindow.uBlock.style.width = '0%';
        }
        
        if (this.counter === 0) { topWindow.uBlock.style.width ='0%'; }
        else {
            topWindow.uBlock.style.width = 100 - (100 * (this.counter/this.delay)) + '%';
        }

        if (topWindow.autoUpdating) setTimeout(()=>{gameStateUpdater.check();}, this.tick);
    }
};

var playerStateUpdater = {
    delay : 6400,
    tick : 200,
    counter : 1000,
    animframe : 0,
    timerID : -1,
    check : function () {       
        if (this.counter > 0) { 
            this.counter -= this.tick;
            
            if (topWindow.player.state == "AWRG") {
                var nickBtnCaption = "РЕГАЮСЬ&nbsp";
                if (this.animframe == 0) nickBtnCaption += ">&nbsp&nbsp";
                if (this.animframe == 1) nickBtnCaption += "&nbsp>&nbsp";
                if (this.animframe == 2) nickBtnCaption += "&nbsp&nbsp>";
                this.animframe++;
                if (this.animframe > 2) this.animframe = 0;         
                topWindow.playerPanel.nickButton.innerHTML = nickBtnCaption;
            }
            //console.log("timerID: "+this.timerID+" counter: "+this.counter);      
            
            if (this.timerID != -1) clearTimeout(this.timerID);
            this.timerID = setTimeout(()=>{playerStateUpdater.check();}, this.tick);
            
        } else { // Загружаем состояние игрока с сервера
            var tdPath = topWindow.hostAdress + "/games/" + topData.UUID  + "/players/" + topWindow.player.UUID;
            var XHR = new XMLHttpRequest();
            XHR.open('GET', tdPath);
            XHR.setRequestHeader('Cache-Control', 'no-cache, no-store, max-age=0');
            
            console.log("playerStateUpdater: XHR");
            
            XHR.onreadystatechange = function() { 
                if (XHR.readyState === XMLHttpRequest.DONE) { 
                    let rText = JSON.parse(XHR.responseText);
                    
                    if (rText.state) {
                        if (rText.state == "IDLE" && topWindow.player.state == "AWRG") topWindow.addLogMessage("хост зарегистрировал игрока");
                        if (rText.state == "IDLE") topWindow.player.state = rText.state;
                        topWindow.playerPanel.answerBtnContainer.style.display = "inline-block";
                        
                        var hostSync = "нет";
                        var indicatorColor = "yellow";
                        if (rText.hsync && rText.hsync == true) {
                            hostSync = "да";
                            indicatorColor = "green";
                        }
                        
                        if (rText.state == "AWRG") {
                            topWindow.playerPanel.indicator.style.backgroundColor = "yellow";
                            topWindow.playerPanel.indicator.title = "Статус: регистрация игрока"+" \r\n Принято ведущим: " + hostSync;
                            topWindow.playerPanel.indicator.innerHTML = "";
                            
                            topWindow.playerPanel.answerBtnContainer.style.display = "none";                            
                        }
                        if (rText.state == "IDLE") {
                            topWindow.playerPanel.indicator.style.backgroundColor = "lightblue";
                            topWindow.playerPanel.indicator.title = "Статус: IDLE"+" \r\n Принято ведущим: " + hostSync;
                            topWindow.playerPanel.indicator.innerHTML = "";
                            
                            topWindow.playerPanel.nickButton.innerHTML = "СМЕНИТЬ >>>";
                                            
                            updateAnswerBtns("IDLE");                                                       
                        }
                        if (rText.state == "ANSW") {
                            topWindow.playerPanel.indicator.style.backgroundColor = indicatorColor;
                            topWindow.playerPanel.indicator.title = "Статус: ответ направлен"+" \r\n Принято ведущим: " + hostSync;
                            topWindow.playerPanel.indicator.innerHTML = "+";
                            
                            topWindow.playerPanel.answerBtnContainer.style.display = "inline-block";
                        }
                        if (rText.state == "WAIT") {
                            topWindow.playerPanel.indicator.style.backgroundColor = indicatorColor;
                            topWindow.playerPanel.indicator.title = "Статус: WAIT"+" \r\n Принято ведущим: " + hostSync;
                            topWindow.playerPanel.indicator.innerHTML = ">";
                        }
                        if (rText.state == "PASS") {
                            topWindow.playerPanel.indicator.style.backgroundColor = indicatorColor;
                            topWindow.playerPanel.indicator.title = "Статус: PASS"+" \r\n Принято ведущим: " + hostSync;
                            topWindow.playerPanel.indicator.innerHTML = "—";
                        }                       

                        
                    } else {
                        topWindow.player.state = "EROR";
                        topWindow.playerPanel.indicator.style.backgroundColor = "red";
                        topWindow.playerPanel.indicator.innerHTML = "!";
                        topWindow.playerPanel.indicator.title = "Ошибка синхронизации, сервер недоступен или сделал хуйню";
                    }
                        
                    if (topWindow.player.state != "IDLE" && topWindow.player.state != "EROR") {
                        playerStateUpdater.counter = playerStateUpdater.delay;
                        this.counter = this.delay;
                        this.timerID = setTimeout(()=>{playerStateUpdater.check();}, this.tick);
                    } else this.timerID = -1;
                    
                }
            };
            XHR.onerror = function() {
                topWindow.playerPanel.indicator.style.backgroundColor = "red";
                topWindow.playerPanel.indicator.innerHTML = "!";
                topWindow.playerPanel.indicator.title = "Проблема сервера";
            
                topWindow.addLogMessage("проблема с сервером");
            };
            XHR.send();
        }   
    }       
};

                
 // Сгенерить UUID
function generateUuidv4() {
    return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c =>
       (+c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> +c / 4).toString(16)
    );
}

// Получаем время в формате "24:60:60"
function getTimeNow () {
    var dNow = new Date();
    
    let tnHours = dNow.getHours().toString();
    if (tnHours.length < 2) { tnHours = '0'+tnHours; }
    let tnMinutes = dNow.getMinutes().toString();
    if (tnMinutes.length < 2) { tnMinutes = '0'+tnMinutes; }
    let tnSeconds = dNow.getSeconds().toString();
    if (tnSeconds.length < 2) { tnSeconds = '0'+tnSeconds; }
            
    return tnHours + ":" + tnMinutes + ":" + tnSeconds;
};

// Преобразуем дату из 01.01.2000 в 01.01.00
function getShortDate (date) {
    if (!date || date.length < 10) return null;
            
    return date.substring(0,6) + date.slice(-2);
}

// Обновляем отображение кнопок ответа игрока
 function updateAnswerBtns(selectedAnswBtn) {
    topWindow.playerPanel.answerBtnReady.style.backgroundColor = topWindow.colorScheme.detailsColor;
    topWindow.playerPanel.answerBtnPass.style.backgroundColor = topWindow.colorScheme.detailsColor;
    topWindow.playerPanel.answerBtnWait.style.backgroundColor = topWindow.colorScheme.detailsColor;
        
    if (selectedAnswBtn == "ANSW") {
        topWindow.playerPanel.answerBtnReady.style.backgroundColor = topWindow.colorScheme.listAccentColor;
        topWindow.player.state = "ANSW";
    } 
    if (selectedAnswBtn == "WAIT") {
        topWindow.playerPanel.answerBtnWait.style.backgroundColor = topWindow.colorScheme.listAccentColor;
        topWindow.player.state = "WAIT";
    }
        
    if (selectedAnswBtn == "PASS") {
        topWindow.playerPanel.answerBtnPass.style.backgroundColor = topWindow.colorScheme.listAccentColor;
        topWindow.player.state = "PASS";
    }

    if (selectedAnswBtn == "IDLE") {
        topWindow.playerPanel.answerTextArea.value = "";
        topWindow.player.state = "IDLE";
    }
        
    topWindow.curAnswerMode = selectedAnswBtn;
}

// Устанавливаем ник игрока, в topWindow, w2g.tv и заодно сохраняем в localStorage
function setPlayerNick(pNick) {
    topWindow.player.nick = pNick;
    
    if (topWindow.playerPanel.nickInput.value != topWindow.player.nick) 
        topWindow.playerPanel.nickInput.value = topWindow.player.nick;
    
    if (W2GNickInput) {
        W2GNickInput.value = pNick;
          
        const kbEvent = new KeyboardEvent('keydown', {
            bubbles: true,
            cancelable: true,
            key: 'Enter',
        });

        W2GNickInput.dispatchEvent(kbEvent);
    }
    
    localStorage.setItem('posani_quiz_player', JSON.stringify(topWindow.player));
}

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

    // Панель опций - цветовая схема, адрес сервера, галочки =========
    topWindow.extraPanel.settingsPanel = document.createElement('div');
    topWindow.extraPanel.settingsPanel.id = "client-settings-panel";
    topWindow.extraPanel.appendChild(topWindow.extraPanel.settingsPanel); 

    topWindow.extraPanel.settingsPanel.topBlock = document.createElement('div');
    topWindow.extraPanel.settingsPanel.topBlock.style.marginTop = "4px";
    topWindow.extraPanel.settingsPanel.appendChild(topWindow.extraPanel.settingsPanel.topBlock); 

    topWindow.extraPanel.settingsPanel.bottomBlock = document.createElement('div');
    topWindow.extraPanel.settingsPanel.appendChild(topWindow.extraPanel.settingsPanel.bottomBlock); 
    

    topWindow.autoUpdateCheckbox = document.createElement('input');
    topWindow.autoUpdateCheckbox.id = 'client-auto-update-checkbox';
    topWindow.autoUpdateCheckbox.type = 'checkbox';
    topWindow.autoUpdateCheckbox.checked = topWindow.autoUpdating;
    topWindow.autoUpdateCheckbox.addEventListener('change', () => {
        if (topWindow.autoUpdateCheckbox.checked) {
            topWindow.autoUpdating = true;
            topWindow.addLogMessage("автообн. запущено");
            gameStateUpdater.check();
        } else {
            topWindow.autoUpdating = false;
            topWindow.addLogMessage("автообн. остановлено");
        }
    });
    var AUcheckboxContainer = document.createElement('div');
    AUcheckboxContainer.id = "autoUpdateCheckboxContainer";
    AUcheckboxContainer.className = "pquiz-checkbox-container";
    AUcheckboxContainer.innerHTML += "&nbsp автообновл.";
    AUcheckboxContainer.style.display = "inline-block";
    AUcheckboxContainer.prepend(topWindow.autoUpdateCheckbox);
    topWindow.extraPanel.settingsPanel.topBlock.appendChild(AUcheckboxContainer);  

    topWindow.colorShemeSelect = document.createElement('select');
    topWindow.colorShemeSelect.className = 'pquiz-select';
    topWindow.colorShemeSelect.id = 'client-select-colorSheme';
    topWindow.colorShemeSelect.value = defaultColorScheme;
    topWindow.colorShemeSelect.setAttribute("list","colorSchemes");
    topWindow.colorShemeSelect.innerHTML = 
        "<datalist id='colorSchemes'>"
            +"<option value='twilight'>Twilight</option>"
            +"<option value='w2g-dark'>W2G-Dark</option>"
            +"<option value='light'>Light</option>"
        +"</datalist>";

    topWindow.colorShemeSelect.selectedIndex = localStorage.getItem("selectedColorSchemeIndex");
    topWindow.colorScheme.name = topWindow.colorShemeSelect.value;
    topWindow.colorShemeSelect.addEventListener('change', () => {
        topWindow.colorScheme.name = topWindow.colorShemeSelect.value;
        topWindow.changeColorScheme(topWindow.colorScheme.name);
        localStorage.setItem("selectedColorSchemeIndex", topWindow.colorShemeSelect.selectedIndex);
    });
    topWindow.extraPanel.settingsPanel.bottomBlock.appendChild(topWindow.colorShemeSelect); 

    topWindow.extraPanel.dataRecieverSelect = document.createElement('select');
    topWindow.extraPanel.dataRecieverSelect.className = 'pquiz-select';
    topWindow.extraPanel.dataRecieverSelect.id = 'select-reciever';     
    
    topWindow.extraPanel.dataRecieverSelect.setAttribute("list", "recieverServers");
    topWindow.extraPanel.dataRecieverSelect.style.marginTop = '3px';
    topWindow.extraPanel.dataRecieverSelect.innerHTML = 
        "<datalist id='recieverServers'>"
            +"<option value='https://quiz.scuf.ru/'>quiz.scuf.ru</option>"
            +"<option value='http://x96101uy.beget.tech/qclp/'>x96.beget.tech</option>"
            +"<option value='http://localhost:8080/pQuiz/'>localhost:8080</option>"             
        +"</datalist>";

    topWindow.extraPanel.dataRecieverSelect.selectedIndex = localStorage.getItem("selectedHostIndex");
    topWindow.hostAdress = topWindow.extraPanel.dataRecieverSelect.value;
    topWindow.extraPanel.dataRecieverSelect.addEventListener('change', () => {         
        if (topWindow.extraPanel.dataRecieverSelect.selectedIndex == 0) {
            topWindow.hostAdress = "https://quiz.scuf.ru/";
            topWindow.addLogMessage("Выбран хост scuf.ru");
        }
        if (topWindow.extraPanel.dataRecieverSelect.selectedIndex == 1) {           
            topWindow.hostAdress = "http://x96101uy.beget.tech/qclp/";
            topWindow.addLogMessage("Выбран хост beget");
        }
        if (topWindow.extraPanel.dataRecieverSelect.selectedIndex == 2) {
            topWindow.hostAdress = "http://localhost:8080/pQuiz/";
            topWindow.addLogMessage("Выбран хост localhost");
        }

        topWindow.playerPanel.nickContainer.style.display = 'none';
        topWindow.playerPanel.answerBtnContainer.style.display = 'none';
        topWindow.topBlock.innerHTML = '<div style="margin-top: 6px; font-weight: 700; font-size: 24px"> ТОП </div>';

        localStorage.setItem("selectedHostIndex", topWindow.extraPanel.dataRecieverSelect.selectedIndex);
    }); 
    topWindow.extraPanel.settingsPanel.bottomBlock.appendChild(topWindow.extraPanel.dataRecieverSelect); 


    topWindow.extraPanel.bottomPanelCheckbox = document.createElement('input');
    topWindow.extraPanel.bottomPanelCheckbox.id = 'client-show-bottom-panel-checkbox';
    topWindow.extraPanel.bottomPanelCheckbox.type = 'checkbox';
    topWindow.extraPanel.bottomPanelCheckbox.checked = true;
    topWindow.extraPanel.bottomPanelCheckbox.addEventListener('change', () => {
        if (topWindow.extraPanel.bottomPanelCheckbox.checked) {            
            topWindow.bottomBlock.style.display = "flex";
        } else {
            topWindow.bottomBlock.style.display = "none";
        }
    });
    var BPcheckboxContainer = document.createElement('div');
    BPcheckboxContainer.id = "bottomPanelCheckboxContainer";
    BPcheckboxContainer.className = "pquiz-checkbox-container";
    BPcheckboxContainer.style.display = "inline-block";    
    BPcheckboxContainer.innerHTML += "&nbspнижняя панель";
    BPcheckboxContainer.prepend(topWindow.extraPanel.bottomPanelCheckbox);
    topWindow.extraPanel.settingsPanel.topBlock.appendChild(BPcheckboxContainer);   

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
    topWindow.cBlock.appendChild(topWindow.headerBlock);
    
    topWindow.headerBlock.captionBlock = document.createElement('div');
    topWindow.headerBlock.captionBlock.id = 'client-top-header-caption';
    topWindow.headerBlock.captionBlock.innerHTML = "[Название]";
    topWindow.headerBlock.appendChild(topWindow.headerBlock.captionBlock);
    
    topWindow.headerBlock.dateBlock = document.createElement('div');
    topWindow.headerBlock.dateBlock.id = 'client-top-header-game-date';
    topWindow.headerBlock.dateBlock.innerHTML = "32.13.46";
    topWindow.headerBlock.appendChild(topWindow.headerBlock.dateBlock);

    topWindow.headerBlock.innerHTML +="<button id='update-data-button'>&#x27F3;</button>";      

    topWindow.topBlock = document.createElement('div');
        topWindow.topBlock.id = 'client-top-table';
        topWindow.topBlock.innerHTML = '<div style="margin-top: 6px; font-weight: 700; font-size: 24px"> ТОП </div>';
        topWindow.cBlock.appendChild(topWindow.topBlock);

    topWindow.updateBlock = document.createElement('div');
    topWindow.updateBlock.innerHTML = 
        "<div id='client-bottom-update'>"
            +"<div id='client-update-progress-bar'></div>"
        +"</div>";
    topWindow.cBlock.appendChild(topWindow.updateBlock);

    // bottom block ===================================================
    topWindow.bottomBlock = document.createElement('div');
    topWindow.bottomBlock.id = 'client-bottom-block';
    topWindow.bottomBlock.style.display = "flex";
    topWindow.bottomBlock.style.flexDirection = "column";
    
    topWindow.bottomPanel = document.createElement('div');
    topWindow.bottomPanel.innerHTML = 
        "<div id='client-bottom-panel-update-time'>00.00.00</div>"
        +"<div id='client-bottom-panel-last-message'></div>"  
        +"<div id='client-bottom-panel-video-adress'>yt~dsfg4DF</div>";
    topWindow.bottomPanel.id = 'client-bottom-panel';
    topWindow.bottomBlock.appendChild(topWindow.bottomPanel);

    topWindow.playerPanel = document.createElement('div');
    topWindow.playerPanel.id = 'client-player-panel';

    topWindow.playerPanel.nickContainer = document.createElement('div');
    topWindow.playerPanel.nickContainer.id = "client-player-panel-nick-container";
    topWindow.playerPanel.nickContainer.style.padding = "3px";
    
    topWindow.playerPanel.indicator = document.createElement('div');
    topWindow.playerPanel.indicator.id = "client-player-panel-indicator";
    topWindow.playerPanel.nickContainer.appendChild(topWindow.playerPanel.indicator);
    
    topWindow.playerPanel.nickInput = document.createElement('input');
    topWindow.playerPanel.nickInput.className = "pquiz-input";
    topWindow.playerPanel.nickInput.id = "client-player-panel-nick-input";
    topWindow.playerPanel.nickInput.addEventListener('change',()=>{
        setPlayerNick( topWindow.playerPanel.nickInput.value);
    });
    topWindow.playerPanel.nickContainer.appendChild(topWindow.playerPanel.nickInput);
    
    topWindow.playerPanel.nickButton = document.createElement('button');
    topWindow.playerPanel.nickButton.className = "pquiz-button";
    topWindow.playerPanel.nickButton.id = "client-player-panel-nick-btn";
    topWindow.playerPanel.nickButton.innerHTML = "УЧАСТВУЮ >>>";
    topWindow.playerPanel.nickButton.addEventListener('click', ()=> {       
        topWindow.player.state = "AWRG";
        updateAnswerBtns("AWRG");
        sendPlayerState();
    });
    topWindow.playerPanel.nickContainer.appendChild(topWindow.playerPanel.nickButton);
    
    topWindow.playerPanel.appendChild(topWindow.playerPanel.nickContainer);

    topWindow.playerPanel.answerBtnContainer = document.createElement('div');
    topWindow.playerPanel.answerBtnContainer.id = "client-player-panel-answer-btn-container";
    topWindow.playerPanel.answerBtnContainer.style.marginTop = '8px';
    
    
    
    topWindow.playerPanel.answerBtnReady = document.createElement('div');
    topWindow.playerPanel.answerBtnReady.innerHTML = "ОТВЕТ";
    topWindow.playerPanel.answerBtnReady.style.borderRadius = "12px 0 0 12px";
    topWindow.playerPanel.answerBtnReady.style.marginLeft = "8px";
    topWindow.playerPanel.answerBtnReady.className = "client-player-panel-answer-btn";
    topWindow.playerPanel.answerBtnReady.addEventListener("click", () => {updateAnswerBtns('ANSW')});  
    topWindow.playerPanel.answerBtnContainer.appendChild(topWindow.playerPanel.answerBtnReady);   

    topWindow.playerPanel.answerBtnWait = document.createElement('div');
    topWindow.playerPanel.answerBtnWait.innerHTML = "ЖДУ";
    topWindow.playerPanel.answerBtnWait.className = "client-player-panel-answer-btn";
    topWindow.playerPanel.answerBtnWait.addEventListener("click", () => {updateAnswerBtns('WAIT')}); 
    topWindow.playerPanel.answerBtnContainer.appendChild(topWindow.playerPanel.answerBtnWait);     

    topWindow.playerPanel.answerBtnPass = document.createElement('div');
    topWindow.playerPanel.answerBtnPass.innerHTML = "ПАС";
    topWindow.playerPanel.answerBtnPass.style.borderRadius = "0 12px 12px 0";
    topWindow.playerPanel.answerBtnPass.className = "client-player-panel-answer-btn";
    topWindow.playerPanel.answerBtnPass.addEventListener("click", () => {updateAnswerBtns('PASS')}); 
    topWindow.playerPanel.answerBtnContainer.appendChild(topWindow.playerPanel.answerBtnPass); 

    topWindow.playerPanel.answerBtnSend = document.createElement('button');
    topWindow.playerPanel.answerBtnSend.disabled = true;
    topWindow.playerPanel.answerBtnSend.className = "pquiz-button";
    topWindow.playerPanel.answerBtnSend.innerHTML = "ОТПРАВИТЬ>>";
    topWindow.playerPanel.answerBtnSend.style.margin = "0 0 0 16px";
    topWindow.playerPanel.answerBtnSend.addEventListener('click', sendPlayerState);

    topWindow.playerPanel.answerBtnContainer.appendChild(topWindow.playerPanel.answerBtnSend);

    topWindow.playerPanel.appendChild(topWindow.playerPanel.answerBtnContainer);

    topWindow.playerPanel.answerTextArea = document.createElement('textarea');
    topWindow.playerPanel.answerTextArea.id = "client-player-panel-answer-textarea";    
    topWindow.playerPanel.answerTextArea.addEventListener('change', ()=>{
        topWindow.player.answer = topWindow.playerPanel.answerTextArea.value;
    });
    topWindow.playerPanel.answerBtnContainer.appendChild(topWindow.playerPanel.answerTextArea);

    topWindow.bottomBlock.appendChild(topWindow.playerPanel);
    topWindow.cBlock.appendChild(topWindow.bottomBlock);
    topWindow.uBlock = document.querySelector('#client-update-progress-bar');
    topWindow.w2gRightBlock = document.querySelector("#w2g-right");

    document.querySelector('#client-bottom-panel-update-time').innerHTML = '00:00:00';
    
    document.querySelector('#update-data-button').addEventListener('click', () => {
        loadTopData();
        
        gameStateUpdater.counter = gameStateUpdater.delay;
        
    });
    
    topWindow.changeColorScheme(topWindow.colorScheme.name);
            
    makeDraggable(topWindow.cBlock);
    
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

    topWindow.setDefaultPositionOnResize = setDefaultPositionOnResize;
    topWindow.setDefaultPosition();
            
    if (topWindow.autoUpdating) {
        gameStateUpdater.check();
        topWindow.addLogMessage("автообн. запущено");
    }
    
    // Создаем нового игрока либо подтягиваем ранее сохраненного
    topWindow.player = JSON.parse(localStorage.getItem('posani_quiz_player'));
    if (topWindow.player && topWindow.player.nick) {
        if (W2GNickInput) W2GNickInput.value = topWindow.player.nick;       
        topWindow.playerPanel.nickInput.value = topWindow.player.nick;
         topWindow.addLogMessage("игрок "+ topWindow.player.nick);
    } else {
        topWindow.player = {};
        topWindow.player.nick = 'player';
        topWindow.player.UUID = generateUuidv4();
        
        topWindow.playerPanel.nickInput.value = topWindow.player.nick;
        localStorage.setItem('posani_quiz_player', JSON.stringify(topWindow.player));
        
        topWindow.addLogMessage("это ноый игрок");
    }
    
    topWindow.addLogMessage("окно инициализировано");
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


// Подгружаем с сервера свежие данные
var loadTopData = function () {
    var tdPath = topWindow.hostAdress + "/curgame"
    var XHR = new XMLHttpRequest();
    XHR.open('GET', tdPath);
    XHR.setRequestHeader('Cache-Control', 'no-cache, no-store, max-age=0');
    XHR.onreadystatechange = function() { 
        if (XHR.readyState === XMLHttpRequest.DONE) { 
            let rText = XHR.responseText;
            rText = JSON.parse(decodeURIComponent(escape(atob(rText))));

            topData = rText;

            if (!topData.players) { 
                 topWindow.addLogMessage("неверные данные");
                return;
            }
            if (!topData.UUID) topData.UUID = "00000000-0000-0000-0000-000000000000";

            updateTopTable();
            topWindow.playerPanel.answerBtnSend.disabled = false;
            
            var tNow = getTimeNow();
      
            document.querySelector('#client-top-header-caption').innerHTML = topData.name;
            document.querySelector('#client-top-header-caption').title = topData.UUID;

            document.querySelector('#client-top-header-game-date').innerHTML = topData.date;

            document.querySelector('#client-bottom-panel-update-time').innerHTML = tNow;            
            document.querySelector('#client-bottom-panel-last-message').innerHTML = 'обновлено успешно';
            document.querySelector('#client-bottom-panel-video-adress').innerHTML = getShortYTAdress(topData.videoAdress);
            
            topWindow.playerPanel.nickContainer.style.display = "flex";

            topWindow.changeColorScheme(topWindow.colorScheme.name);

            if (topData.stopped) {
                if (topData.stopped == true) {
                    topWindow.autoUpdating = false;
                    topWindow.autoUpdateCheckbox.checked = false;
                    topWindow.addLogMessage("игра остановлена");
                } else topWindow.addLogMessage("игра синхронизирована");
            } else topWindow.addLogMessage("игра синхронизирована");
        }
    };
    XHR.onerror = function() {          
        topWindow.addLogMessage("проблема с сервером");
    };
    XHR.send();
};


// Отправляем состояние игрока на сервер
function sendPlayerState () {
    var psPath = topWindow.hostAdress +"/pRec.php";
    var XHR = new XMLHttpRequest();
    XHR.open('POST', psPath);
    XHR.setRequestHeader('Cache-Control', 'no-cache, no-store, max-age=0');
    XHR.onreadystatechange = function() { 
        if (XHR.readyState === XMLHttpRequest.DONE) { 
            let rText = XHR.responseText;
            
            var tNow = getTimeNow();
            document.querySelector('#client-bottom-panel-update-time').innerHTML = tNow;      

            if (rText == "SC") {
                topWindow.addLogMessage("статус "+topWindow.player.state+" передан");
                
                playerStateUpdater.check();
            } else { 
                topWindow.playerPanel.indicator.style.backgroundColor = "red";
                topWindow.playerPanel.indicator.innerHTML = "!";
                topWindow.playerPanel.indicator.title = "проблема сервера";
            }
        }
    };
    
    XHR.onerror = function() {
        topWindow.playerPanel.indicator.style.backgroundColor = "red";
        topWindow.playerPanel.indicator.innerHTML = "!";
        topWindow.playerPanel.indicator.title = "Проблема сервера";
            
        topWindow.addLogMessage("проблема с сервером");
    };
    
    var sendData = {
        type : "psync",
        gameUUID : topData.UUID,
        player : {
            name : topWindow.player.nick,
            UUID : topWindow.player.UUID,
            state : topWindow.player.state,
            answer : topWindow.player.answer
        }
    }

    //console.log(JSON.stringify(sendData));
    XHR.send(JSON.stringify(sendData));
    
    topWindow.playerPanel.indicator.style.backgroundColor = "yellow";
    topWindow.playerPanel.indicator.innerHTML = "^";
    topWindow.playerPanel.indicator.title = "Состояние синхронизируется";
};


// Перестраиваем таблицу топа с актуальной информацией
var updateTopTable = function()  {
    const sortFn = (a, b) => {
        if (a.points < b.points) { return 1; 
        } else if (a.points > b.points) { return -1; }
            return 0; 
    };

    topData.players.sort(sortFn);

    topWindow.topBlock.innerHTML = "";

    var placeN = 1;
    for (let i = 0; i < topData.players.length; i++) { 

        pString = "&nbsp&nbsp"+placeN + "&nbsp";
        if (placeN == 1) { pString = "&#127942"; }
        if (placeN == 2) { pString = "&#129352"; }
        if (placeN == 3) { pString = "&#129353"; }

        topWindow.topBlock.innerHTML += 
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

var W2GNickInput = document.querySelector("#nickname-form-nickname");

topWindow.hostAdress = defaultHostAdress;

window.addEventListener("load", ()=>{
    // Запускаем ету шарманку
    initTopWindow();
});

// Выравниваем форму по центру при ресайзе окна браузера
window.addEventListener('resize', () => {
    topWindow.setDefaultPosition()
});


if (W2GNickInput) W2GNickInput.addEventListener('change', () => {
    topWindow.playerPanel.nickInput.value = W2GNickInput.value;
    setPlayerNick(W2GNickInput.value);
});