const terminalCommands = [
  function cls() {
    actualTerminal = document.getElementById(`terminal-${currentTerminal}`)
    actualTerminal.innerHTML = ''
    terminalsdict[currentTerminal].tabsContent[currentTab].content = [];
    console.info('Cleared')
  },
  function python(scriptPath){
    console.log(terminalsdict[currentTerminal].tabsContent[currentTab].shellid)
    shellid = terminalsdict[currentTerminal].tabsContent[currentTab].shellid
    window.electron.runPythonScript(scriptPath, `py-${shellid}`, currentTab, currentTerminal)
  }
  
];

function addCommand(name, func) {
  if (!terminalCommands.some((cmd) => cmd.name === name)) {
  } else {
    console.log(`The ${name} commands already exists.`);
  }
}
