const createTabBtn = document.getElementById('createtab');
const chat = document.getElementById('terminal-1');
const tabs = document.getElementById('tabs-terminal-1')
const chatBounds = chat.getBoundingClientRect();
const chatCenterX = chatBounds.left + chatBounds.width / 2;

let tabdragged;

let dragging = false;

let tabidx = 1;
let currentTab = 1;

const firstTab = {
    id: tabidx,
    content: []
};


terminalsdict[currentTerminal].tabsContent[tabidx] = firstTab;

//Crear Tab en idx (Terminal donde se requiere crear la tab)

function createTab(idx) {
    if (configs["createTabSound"] === true){
        soundRep(selectedFiles["createTabSelectedSound"])
    }


    const tabs = document.getElementById(`tabs-terminal-${idx}`)


    tabidx++;

    const newTab = {
        id: tabidx,
        content: []
    };

    terminalsdict[idx].tabsContent[tabidx] = newTab;

    const tabtemplate = `
            <div class="tab" draggable="true" id="tab${tabidx}" terminal-tab="${idx}" oncontextmenu="tabContext(event, ${idx}, ${tabidx})" onclick="changeCurrentTabTo(${idx},${tabidx})">
                <p>New tab</p>
                <button class="closetab" onclick="closeTab(${idx}, ${tabidx}, event)">
                <i class="fa-solid fa-xmark"></i>
                </button>
            </div>
        `;

    tabs.innerHTML += tabtemplate;


    const actualTab = document.getElementById(`tab${tabidx}`)

    setTimeout(() => {
        actualTab.style.opacity = 1
    }, 0.5);
    changeCurrentTabTo(idx, tabidx)
    actualTab.scrollIntoView({ behavior: 'smooth', block: 'end' });
}


function assignTabListeners() {
    const tabs = document.querySelectorAll(`.tabs`);

    tabs.forEach(tab => {

        tab.addEventListener('wheel', function (event) {
            this.scrollLeft -= event.deltaY * 1.1;

            event.preventDefault();
        })

        tab.addEventListener('dragstart', (event) => {
            if (configs["dragTabSound"] === true){
                soundRep(selectedFiles["dragTabSelectedSound"])
            }
            dragging = true
            const target = event.target.closest('.tab');
            const terminalOfTab = target.getAttribute('terminal-tab');
            event.dataTransfer.setData('tab/idx', target.id)
            event.dataTransfer.setData('tab/terminal', terminalOfTab)


            if (target) {

                tabdragged = target.id;
                document.getElementById(tabdragged).classList.add('dragging');

                event.dataTransfer.setDragImage(document.getElementById('transparentCursor'), 0, 0);

                const tabWidth = target.offsetWidth;
                const tabHeight = target.offsetHeight;
                target.dataset.tabWidth = tabWidth;
                target.dataset.tabHeight = tabHeight;
            }
        });

        tab.addEventListener('drag', (event) => {
            const target = event.target.closest('.tab');
            console.log()

            if (target) {
                const tabWidth = parseFloat(target.dataset.tabWidth);
                const tabHeight = parseFloat(target.dataset.tabHeight);

                target.style.position = 'absolute';
                target.style.width = tabWidth + 'px';
                target.style.height = tabHeight + 'px';
                target.style.top = `${event.clientY - tabHeight / 2 + tabHeight}px`;
                target.style.left = `${event.clientX - tabWidth / 2}px`;
            }
        });


        tab.addEventListener('dragend', (event) => {
            event.preventDefault();
            dragging = false
            const target = event.target.closest('.tab');


            if (target) {
                document.getElementById(tabdragged).classList.remove('dragging');
                target.style.width = '-webkit-fill-available';
                target.style.height = '10%';
                target.style.position = 'static';
            }
            splitPreview.style.display = 'none'
        });
    })
}

function foundClosestTab(idxtt, from) {
    const tabsContent = terminalsdict[idxtt].tabsContent;
    const tabIds = Object.keys(tabsContent).map(Number).sort((a, b) => a - b);

    let closestTab = null;
    let minDistance = Infinity;

    for (const tabId of tabIds) {
        const distance = Math.abs(tabId - from);
        if (distance < minDistance) {
            minDistance = distance;
            closestTab = tabId;
        }
    }

    return closestTab;
}
function changeCurrentTabTo(idxtt, idxt) {
    const activeterminal = document.querySelectorAll('.chat.activedterminal');
    const activetab = document.querySelector('.tab.actived');
    const thistab = document.getElementById(`tab${idxt}`);
    const thisterminal = document.getElementById(`terminal-${idxtt}`);
    console.log(idxtt, idxt);

    idxt = parseInt(idxt, 10);
    idxtt = parseInt(idxtt, 10);

    if (idxt !== currentTab) {

        terminalsdict[idxtt].currentTabInTerminal = idxt;
        currentTab = idxt;

        currentTerminal = idxtt;

        addElementsPushed(idxtt, idxt);
        thistab.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }

    if (activetab) {
        activetab.classList.remove('actived');
    }
    thistab.classList.add('actived');

    if (activeterminal) {
        activeterminal.forEach(terminal =>{
            terminal.classList.remove('activedterminal')
        })
    }
    thisterminal.classList.add('activedterminal');
}

function closeTab(idxtt, idxt, event) {
    if (configs["closeTabSound"] === true){
        soundRep(selectedFiles["closeTabSelectedSound"])
    }
    if (event) { event.stopPropagation(); }

    const tabToClose = document.getElementById(`tab${idxt}`);
    if (tabToClose) { tabToClose.style.opacity = '0'; }

    setTimeout(() => {
        tabToClose.remove();
        delete terminalsdict[idxtt].tabsContent[idxt]

        if (Object.keys(terminalsdict[idxtt].tabsContent).length === 0) {
            const terminalToRemove = document.getElementById(`terminalContainer-${idxtt}`);
            terminalToRemove.remove();
            delete terminalsdict[idxtt];
            terminalCount--

            if (currentTerminal === idxtt) {
                let lowerTab = null;

                for (const key in terminalsdict[idxtt - 1].tabsContent) {
                    const numericKey = parseInt(key, 10);
                    if (numericKey < idxt && (lowerTab === null || numericKey > lowerTab)) {
                        lowerTab = numericKey;
                    }
                }

                if (lowerTab !== null) {
                    changeCurrentTabTo(idxtt - 1, lowerTab);
                }
            }
        } else {
            closestTab = foundClosestTab(idxtt, idxt)
            changeCurrentTabTo(idxtt, closestTab)
        }
    }, 100)
}

function addElementsPushed(idxtt, idxt) {
    const terminal = document.getElementById(`terminal-${idxtt}`)
    terminal.innerHTML = '';

    terminalsdict[idxtt].tabsContent[idxt].content.forEach(message => {
        terminal.appendChild(message);
        message.scrollIntoView({ behavior: 'auto', block: 'end' });
    });
}

function pushTabElements(topush) {
    terminalsdict[currentTerminal].tabsContent[currentTab].content.push(topush);
}

function closeAllTabs(idxtt) {
    const currentTerminalTabs = terminalsdict[idxtt].tabsContent;
    const tabIds = Object.keys(currentTerminalTabs).map(Number).sort((a, b) => a - b);

    for (let i = 1; i < tabIds.length; i++) {
        const tabId = tabIds[i];
        closeTab(currentTerminal, tabId);
    }
}

function moveTab() {
    const terminalIds = Object.keys(terminalsdict[currentTerminal]).map(Number).sort((a, b) => a - b);
    const currentTabIdx = terminalIds.indexOf(currentTerminal);

    if (currentTabIdx !== -1) {
        let nextTabIdx = currentTabIdx + 1;
        if (nextTabIdx >= tabIds.length) {
            nextTabIdx = 0; // Regresa al principio si llega al final
        }
        const nextTab = tabIds[nextTabIdx];
        changeCurrentTabTo(currentTerminal, nextTab);
    }
}

assignTabListeners()