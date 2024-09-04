const mainContainer = document.getElementById("mainContainer");
const splitPreview = document.getElementById("splitPreview");
const splits = document.querySelectorAll(".split");

let currentTerminal = 1;

let terminalCount = 1;

const terminalsdict = {};

terminalsdict[1] = {
  currentTabInTerminal: 1,
  tabsContent: {},
};

function createTerminal(idxtt, idx) {
  terminalCount++;
  currentTerminal = terminalCount;

  terminalsdict[terminalCount] = {
    currentTabInTerminal: idx,
    tabsContent: {
      [idx]: {
        id: idx,
        terminal: terminalCount,
        shellid: undefined,
        content: [], // Inicializar la pestaña con un array vacío
      },
    },
  };

  const previousTerminal = terminalsdict[idxtt];
  const tabToMove = previousTerminal.tabsContent[idx];

  // Copiar el contenido de la pestaña original a la nueva pestaña
  terminalsdict[terminalCount].tabsContent[idx] = {
    id: tabToMove.id,
    terminal: terminalCount,
    subprocesses: [...tabToMove.subprocesses],
    processes: tabToMove.processes,
    shellid: tabToMove.shellid,
    content: [...tabToMove.content], // Copia profunda del array de contenido
  };

  editShellTab(terminalCount, idx, terminalCount, tabToMove.id);

  delete previousTerminal.tabsContent[idx];
  previousTerminal.currentTabInTerminal = foundClosestTab(idxtt, idx);

  const lastValue = Object.values(terminalsdict[idxtt].tabsContent).pop();
  addElementsPushed(idxtt, lastValue.id);

  const terminaltemplate = `   
  <div class="chatContainer" id="terminalContainer-${terminalCount}">
    <div class="tab_nav">
      <img id="transparentCursor"
      src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/w8AAwAB/EX+uOIAAAAASUVORK5CYII="
      style="display: none;">
      <div class="tabs" oncontextmenu="tabsContextMenu(${terminalCount}, event)" id="tabs-terminal-${terminalCount}">
        <div class="tab" style="opacity: 1;" oncontextmenu="tabContext(event, ${terminalCount}, ${idx})" onclick="changeCurrentTabTo(${terminalCount},${idx})" id="tab${idx}">
          <p>Splitted ${idx}</p>
          <button class="closetab" onclick="closeTab(${terminalCount}, ${idx}, event)">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
      </div>
      <button class="createtab" id="createtab" onclick="createTab(${terminalCount}, 'Tab')">
        <i class="fa-solid fa-plus"></i>
      </button>
    </div>
    <div class="chat activedterminal" id="terminal-${terminalCount}">

    </div>
  
    <div class="chatControls" onclick="changeCurrentTabTo(${terminalCount}, terminalsdict[${terminalCount}].currentTabInTerminal)">
      <div class="inputContainer">
        <input class="chatInput" id="chatInput-terminal-${terminalCount}" type="text" placeholder=">_">
      </div>
      <button class="sendButton" onclick="sendMessageFromChatField(${terminalCount});" id="sendButton"><i class="fa-solid fa-chevron-right"></i></button>
    </div>
  </div>
  `;
  return {
    terminaltemplate,
    tab: terminalsdict[currentTerminal].tabsContent[idx],
  };
}

document.body.addEventListener("dragover", (event) => {
  event.preventDefault();
  if (dragging) {
    splitPreview.style.display = "flex";
    setTimeout(() => {
      splitPreview.style.opacity = 1;
    }, 100);
  }
});

function mouseEnter(event) {
  event.currentTarget.classList.add("dragover");
  event.stopPropagation();
}

function mouseLeave(event) {
  event.currentTarget.classList.remove("dragover");
  event.stopPropagation();
}

function handleDrop(event) {
  event.preventDefault();

  if (configs["dropTabSound"] === true) {
    soundRep(selectedFiles["dropTabSelectedSound"]);
  }

  const dataidx = event.dataTransfer.getData("tab/idx");
  const dataterminal = event.dataTransfer.getData("tab/terminal");

  const tab = document.getElementById(dataidx);
  let tabidx = dataidx.replace("tab", "");
  tabidx = parseInt(tabidx, 10);
  const containerId = event.currentTarget.id;

  tab.remove();
  if (containerId == "left") {
    const { terminaltemplate, tab } = createTerminal(dataterminal, tabidx);
    mainContainer.insertAdjacentHTML("afterbegin", terminaltemplate);
    addElementsPushed(currentTerminal, tab.id);
  } else if (containerId == "right") {
    const { terminaltemplate, tab } = createTerminal(dataterminal, tabidx);

    mainContainer.insertAdjacentHTML("beforeend", terminaltemplate);
    addElementsPushed(currentTerminal, tab.id);
  }

  let lastterminal = Object.keys(terminalsdict).length;
  changeCurrentTabTo(lastterminal, tabidx);
  assignTabListeners();
  splitPreview.style.display = "none";
}

splits.forEach((split) => {
  split.addEventListener("dragover", (event) => {
    event.preventDefault();
  });

  split.addEventListener("drop", handleDrop);
  split.addEventListener("dragenter", mouseEnter);
  split.addEventListener("dragleave", mouseLeave);
});

function sendMessageFromChatField(idx) {
  const chatfield = document.getElementById(`chatInput-terminal-${idx}`);
  const message = chatfield.value.trim();

  if (message !== "" && idx === currentTerminal) {
    if (configs["sendMessageSound"] === true) {
      soundRep(selectedFiles["sendMessageSelectedSound"]);
    }

    messagesBuffer.push({
      message,
      type: "message",
      idxtt: idx,
      idxt: currentTab,
    });
    processMessagesBuffer();
    chatfield.value = "";

    // Divide el mensaje en partes: el primer elemento es el comando, el resto son argumentos
    const [commandName, ...args] = message.split(" ");

    // Busca y ejecuta la función cuyo nombre coincide con el comando
    const command = terminalCommands.find((cmd) => cmd.name === commandName);
    if (command) {
      // Llama a la función con todos los argumentos
      command(...args);
    } else {
      shellid = terminalsdict[idx].tabsContent[currentTab].shellid;
      console.log(shellid);
      window.electron.runCmd(message, shellid);
    }
  }
}

document.addEventListener("keydown", function (event) {
  const actualField = document.getElementById(
    `chatInput-terminal-${currentTerminal}`
  );
  if (event.key === "Enter") {
    if (document.activeElement === actualField) {
      sendMessageFromChatField(currentTerminal);
    }
  }
});
