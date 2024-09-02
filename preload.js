const { contextBridge, ipcRenderer, globalShortcut } = require("electron");
const { exec } = require("child_process");
const fs = require("fs");
const net = require("net");
const path = require("path");
const { spawn } = require("child_process");
const { rejects } = require("assert");

// Cargar solo módulos válidos
contextBridge.exposeInMainWorld("electron", {
  startShell: (shellid, tabidx, terminalidx) => ipcRenderer.send("start-shell", { shellid, tabidx, terminalidx }),
  editShell: (shellid, terminalidx, tabidx) => ipcRenderer.send("edit-shell", {shellid, terminalidx, tabidx}),
  runCmd: (command, shellid) => ipcRenderer.send("run-cmd", { command, shellid }),
  stopShell: (shellid) => ipcRenderer.send("stop-shell", { shellid }),
  stopAllShells: () => ipcRenderer.send("close-all"),
  createNewWindow: () => ipcRenderer.send('create-new-window'),
  runPythonScript: (scriptPath, shellid, tabidx, terminalidx) => ipcRenderer.send('run-python', {scriptPath, shellid, tabidx, terminalidx}),

  onCmdOutput: (callback) =>
    ipcRenderer.on("shell-output", (event, message) => callback(message)),
  openDevTools: () => ipcRenderer.send("devtools"),
  loadModules: () => ipcRenderer.send("loadModules"),
  onModulesLoaded: (callback) =>
    ipcRenderer.on("modulesLoaded", (event, modules) => callback(modules)),
  loadFiles: (folderPath, validExtensions) => {
    ipcRenderer.send("loadFiles", {
      folderName: folderPath,
      validExtensions: [validExtensions],
    });
  },
  onFilesLoaded: (callback) => {
    ipcRenderer.on("filesLoaded", (event, validFiles) => callback(validFiles));
  },
  send: (channel, data) => ipcRenderer.send(channel, data),
  on: (channel, callback) =>
    ipcRenderer.on(channel, (event, ...args) => callback(...args)),
});
