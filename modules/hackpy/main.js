import { addCommand, terminalCommands } from "../../views/js/commands.js";

export function initModule() {
  console.info("Soy un gato");
  addCommand(hackpy);
}

export function startModule() {
  terminalCommands[1]("python", "modules/hackpy/root/main.py");
  hackpy();
}

export function hackpy() {
  const Tabs = [
    { Client: "../modules/hackpy/views/client/clientview.js" },
    { Server: "../modules/hackpy/views/server/serverview.js" },
  ];
  
  openModal(Tabs)
}

