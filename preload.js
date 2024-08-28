const { contextBridge, ipcRenderer, globalShortcut } = require("electron");
const { exec } = require("child_process");
const fs = require("fs");
const net = require("net");
const path = require("path");
const { spawn } = require("child_process");
const { rejects } = require("assert");

// Cargar solo módulos válidos
contextBridge.exposeInMainWorld("electron", {
  runCmd: (command) => ipcRenderer.send("run-cmd", command),
  onCmdOutput: (callback) =>
    ipcRenderer.on("cmd-output", (event, message) => callback(message)),
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

  // Configura un manejador para escuchar la respuesta con archivos cargados
  onFilesLoaded: (callback) => {
    ipcRenderer.on("filesLoaded", (event, validFiles) => callback(validFiles));
  },
  send: (channel, data) => ipcRenderer.send(channel, data),
  on: (channel, callback) =>
    ipcRenderer.on(channel, (event, ...args) => callback(...args))
});
