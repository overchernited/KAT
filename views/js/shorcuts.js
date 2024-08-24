let ctrlPressed = false;
let altPressed = false;

let processingAction = false;
let actionTimeout = null;


function processAction(action) {
    if (!processingAction) {
        processingAction = true;
        action();
        actionTimeout = setTimeout(() => {
            processingAction = false;
        }, 200);
    }
}

document.addEventListener('keydown', function (event) {
    if (event.key === 'Control') {
        ctrlPressed = true;
    }

    if (event.key === 'Alt') {
        altPressed = true;
    }

    if (!processingAction && ctrlPressed) {
        if (event.key === 'n') {
            processAction(() => createTab(currentTerminal));
        } else if (event.key === 'Tab') {
            moveTab()
        } else if (event.key === 'b'){
            collapseModulesTab();
        }
    }
    if (!processingAction && altPressed) {
        if (event.key == 'w') {
            closeAllTabs(currentTerminal)
        }
    }
});

window.addEventListener('closeTab', () => {
    if (currentTab !== 1) { processAction(() => closeTab(currentTerminal, currentTab)) }
});

document.addEventListener('keyup', function (event) {
    if (event.key === 'Control') {
        ctrlPressed = false;
    }
    if (event.key === 'Alt') {
        altPressed = false;
    }
});

// Limpia el timeout al salir de la página o ventana
window.addEventListener('beforeunload', () => {
    clearTimeout(actionTimeout);
});