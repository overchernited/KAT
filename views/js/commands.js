export const terminalCommands = [
  function cls() {
    let actualTerminal = document.getElementById(`terminal-${currentTerminal}`);
    actualTerminal.innerHTML = "";
    terminalsdict[currentTerminal].tabsContent[currentTab].content = [];
    console.info("Cleared");
  },
  function spawn(command, scriptPath) {
    let shelltab = terminalsdict[currentTerminal].tabsContent[currentTab];
    let tabsubprocess = shelltab.processes;
    shelltab.processes = tabsubprocess + 1;
    const shellid = `${Math.random().toString(36).substr(2, 9)}-${Date.now()}`;

    // Agrega el shellid al array subprocesses
    shelltab.subprocesses.push({
      id: `sub-${shellid}`,
    });

    window.electron.spawn(
      command,
      scriptPath,
      `sub-${shellid}`,
      currentTab,
      currentTerminal
    );
  },
  function python(scriptPath){
    terminalCommands[1]("python", scriptPath)
  }
];

export function addCommand(func) {
  terminalCommands.push(func);
  console.log('Nuevo comando añadido.');
}
window.terminalCommands = terminalCommands