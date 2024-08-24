const decoder = new TextDecoder('utf-8');
const py = window.modules.py
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
  if (isNearBottom) {
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

// Credits, Info, ETC // No relevant code

const versionTemplate = 
`
<div>
    <p style="font-size:1.8vw; font-weight: 600;">Kat Terminal v1.0</p>
    <p style="font-size:1.6vw; font-weight: 500;">Created and added features!</p>
    <br>
    <p style="font-size:1.25vw; font-weight: 500;">- Tabs: A system of tabs has been created and added with the app, in the right corner there<br>
        the Create tab button which can create many terminal tabs.</p>
    <br>
    <p style="font-size:1.25vw; font-weight: 500;"> With them also have been added their shortcuts: </p>
    <br>
    <p style="font-size:1.25vw; font-weight: 600;"> Ctrl + N to create a tab </p>
    <p style="font-size:1.25vw; font-weight: 600;"> Ctrl + W to delete the current tab </p>
    <p style="font-size:1.25vw; font-weight: 600;"> Ctrl + Tab to move to the right tab </p>
    <p style="font-size:1.25vw; font-weight: 600;"> Alt + W to delete all created tabs</p>
    <p style="font-size:1.25vw; font-weight: 600;"> Ctrl + B to open the modules tab</p>
    <br>
    <p style="font-size:1.25vw; font-weight: 500;"> - Modules: You can easily create your modules using the terminal methods. To install, simply drag and drop them into the 'modules' folder.</p>
    <p style="font-size:1.25vw; font-weight: 500;"> - Contextual menu: Now includes functions like refreshing the application, showing the developer console, and managing tabs.</p>
    <p style="font-size:1.25vw; font-weight: 500;">- Console messages (log, warn, error) are styled to appear in the terminal</p>
</div>
`

console.info(versionTemplate)
console.warn('xd')
console.error('xd2')