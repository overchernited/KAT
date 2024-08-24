const contextMenu = document.getElementById('contextMenu');
let opened = false;
let contextDisplay;
let contextOpacity;

const defaultContext =
    `
<div class="contextOption" onclick="reloadwindow()">
    <p class="optionLabel">Reload app</p>
    <p class="shortcut">Ctrl + R</p>
</div>
<div class="contextOption" onclick="openDevTools()">
    <p class="optionLabel">Open devtools</p>
    <p class="shortcut">Ctrl + I</p>
</div>
`



function determine() {
    contextDisplay = opened ? 'flex' : 'none';
    contextOpacity = opened ? '1' : '0'
}

function tabContext(event, terminalidx, tabidx) {
    const tab =
        `
    <div class="contextOption" onclick="closeTab(${terminalidx} , ${tabidx})">
        <p class="optionLabel">Close tab</p>
    </div>
    `
    setContextMenu(event, tab)
}

function tabsContextMenu(idxtt, event) {
    const tabsContext =
        `
<div class="contextOption" onclick="createTab(${idxtt})">
    <p class="optionLabel">Create tab</p>
    <p class="shortcut">Ctrl + N</p>
</div>
<div class="contextOption" onclick="closeAllTabs(${idxtt})">
    <p class="optionLabel">Close all tabs</p>
    <p class="shortcut">Alt + W</p>
</div>
`
    setContextMenu(event, tabsContext)
}

function bodyContext(event) {
    setContextMenu(event, defaultContext)
}


function setContextMenu(event, template) {
    contextMenu.innerHTML = template
    openContextMenu(event)
}

function openContextMenu(event) {
    opened = true;
    determine();
    event.preventDefault();
    event.stopPropagation()

    const height = contextMenu.offsetHeight;
    const width = contextMenu.offsetWidth;

    const cursorX = event.clientX;
    const cursorY = event.clientY;

    contextMenu.style.top = `${cursorY + height / 1.5}px`;
    contextMenu.style.left = `${cursorX - width / 5}px`;

    setTimeout(() => {
        contextMenu.style.display = contextDisplay;
    }, 10);
    setTimeout(() => {
        contextMenu.style.opacity = contextOpacity;
    }, 30);
}

document.addEventListener('click', () => {
    if (opened) {
        opened = false;
        determine()
        contextMenu.style.opacity = contextOpacity;
        setTimeout(() => {
            contextMenu.style.display = contextDisplay;
        }, 80);
    }
});

function reloadwindow() {
    window.location.reload();
}

function openDevTools() {
    window.modules.api.send('devtools')
}