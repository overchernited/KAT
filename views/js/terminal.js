// const decoder = new TextDecoder('utf-8');
// const py = window.modules.py


let messagesBuffer = [];

const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;
const originalConsoleLog = console.log
const originalConsoleInfo = console.info


const logToTerminal = (message, type = 'message', terminalid) => {
  const terminal = document.getElementById(`terminal-${terminalid}`)
  const outputDiv = document.createElement('div');
  outputDiv.className = `terminal-message ${type}`;

  let icon;
  switch (type) {
    case 'error':
      icon = 'fa-circle-exclamation';
      break;
    case 'warning':
      icon = 'fa-triangle-exclamation';
      break;
    case 'info':
      icon = 'fa-circle-info';
      break;
    case 'message':
      icon = 'fa-message'
      break;
    default:
      icon = '';
  }

  outputDiv.innerHTML = `
    <i class="message_ico fa-solid ${icon}"></i>
    <p class="message_text" >${message}</p>
  `;
  terminal.appendChild(outputDiv);
  let isNearBottom = terminal.scrollHeight - terminal.scrollTop <= terminal.clientHeight + configs["scrollZoneSize"];
  if (isNearBottom && configs["AlwaysScroll"] == false) {
    outputDiv.scrollIntoView({ behavior: 'smooth', block: 'end' });
  } else if (configs["AlwaysScroll"] == true){
    outputDiv.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }
  console.log(isNearBottom)
  pushTabElements(outputDiv)
};

window.onerror = function (message, source, lineno, colno, error) {
  messagesBuffer.push({ message, type: 'error', id: currentTerminal});
  processMessagesBuffer();
};

console.error = function (message) {
  messagesBuffer.push({ message, type: 'error', id: currentTerminal});
  processMessagesBuffer();
  originalConsoleError.apply(console, arguments);
};

console.warn = function (message) {
  messagesBuffer.push({ message, type: 'warning', id: currentTerminal});
  processMessagesBuffer();
  originalConsoleWarn.apply(console, arguments);
};

console.info = function (message) {
  messagesBuffer.push({ message, type: 'info', id: currentTerminal});
  processMessagesBuffer();
  originalConsoleInfo.apply(console, arguments); // Llama a la función original
}

// console.log = function (message) {
//   messagesBuffer.push({ message, type: 'message', id: currentTerminal});
//   processMessagesBuffer();
//   originalConsoleLog.apply(console, arguments);
// };


// function setMessage(data){
//   const messages = decoder.decode(data).split(/\r?\n/);

//   messages.forEach((msg) => {
//     let type = 'message';
//     let decodedString = msg.trim();

//     if (decodedString === '') {
//       return;
//     }

//     if (decodedString.startsWith('[ERROR]')) {
//       type = 'error';
//       decodedString = decodedString.replace('[ERROR]', '');
//     } else if (decodedString.startsWith('[WARNING]')) {
//       type = 'warning';
//       decodedString = decodedString.replace('[WARNING]', '');
//     } else if (decodedString.startsWith('[INFO]')) {
//       type = 'info';
//       decodedString = decodedString.replace('[INFO]', '');
//     }

//     messagesBuffer.push({ message: messages, type });
//     processMessagesBuffer();
//   });
// }

const processMessagesBuffer = () => {
  if (messagesBuffer.length > 0) {
    messagesBuffer.forEach(({ message, type, id }) => {
      logToTerminal(message, type, id);
    });
    messagesBuffer = [];
  }
};

window.electron.onCmdOutput((data) => {
  const {type, idx, message} = data;
  const formattedMessage = message.replace(/(\r\n|\n|\r)/g, '<br>');
  console.log(message, formattedMessage, messagesBuffer)
  messagesBuffer.push({ message: formattedMessage, type: type, id: idx });
  processMessagesBuffer();
});
// Credits, Info, ETC // No relevant code

const versionTemplate = 
`
<div>
    <p style="font-size:1.8vw; font-weight: 600;">Kat Terminal v1.0</p>
    <p style="font-size:1.6vw; font-weight: 500;">New Features Added!</p>
    <br>
    <p style="font-size:1.25vw; font-weight: 500;">
        - **Configuration Page:** A new configuration page has been added where you can manage various settings and preferences for the application.
    </p>
    <br>
    <p style="font-size:1.25vw; font-weight: 500;">
        - **Tabs:** A tab system has been introduced, allowing you to create multiple terminal tabs. You can find the "Create Tab" button in the top right corner, which enables the creation of new tabs.
    </p>
    <br>
    <p style="font-size:1.25vw; font-weight: 500;">
        - **Shortcuts:** New keyboard shortcuts have been added for easier tab management:
    </p>
    <br>
    <p style="font-size:1.25vw; font-weight: 600;">Ctrl + N to create a new tab</p>
    <p style="font-size:1.25vw; font-weight: 600;">Ctrl + W to close the current tab</p>
    <p style="font-size:1.25vw; font-weight: 600;">Ctrl + Tab to switch to the next tab</p>
    <p style="font-size:1.25vw; font-weight: 600;">Alt + W to close all tabs</p>
    <p style="font-size:1.25vw; font-weight: 600;">Ctrl + B to open the modules tab</p>
    <br>
    <p style="font-size:1.25vw; font-weight: 500;">
        - **Modules:** Easily create your own modules using terminal methods. To install a module, simply drag and drop it into the 'modules' folder.
    </p>
    <p style="font-size:1.25vw; font-weight: 500;">
        - **Contextual Menu:** The contextual menu now includes functions for refreshing the application, opening the developer console, and managing tabs.
    </p>
    <p style="font-size:1.25vw; font-weight: 500;">
        - **Console Messages:** Console messages (log, warn, error) are now styled to appear in the terminal.
    </p>
    <br>
    <p style="font-size:1.25vw; font-weight: 500;">
        - **Theme Functionality:** A new theme feature has been added to the configuration page. In the Kat Terminal folder, you’ll find a new directory where you can add your themes by editing the CSS variables.
    </p>
    <p style="font-size:1.25vw; font-weight: 500;">
        - **Sound Customization:** You can now select different sounds for specific actions in the terminal. A new folder called 'sounds' has been added, where you can place and manage your custom sounds. Additionally, there is an option to manage automatic or persistent scrolling.
    </p>
</div>
`

console.info(versionTemplate)