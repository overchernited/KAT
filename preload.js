const { contextBridge, ipcRenderer, globalShortcut } = require("electron");
const { exec } = require("child_process");
const fs = require("fs");
const net = require("net");
const path = require("path");
const { spawn } = require("child_process");
const { rejects } = require("assert");

const modules = {
  katmodules: {
    moduleFolderPath: path.join(__dirname, "modules"),
    loadModules: function (modules, loadedPreloads) {
      return new Promise((resolve, reject) => {
        try {
          this.moduleFolders = fs.readdirSync(this.moduleFolderPath);
          const moduleFolderPath = this.moduleFolderPath;
          const moduleFolders = this.moduleFolders;

          const validModules = [];

          moduleFolders.forEach((folder) => {
            const folderPath = path.join(moduleFolderPath, folder);
            const filesInFolder = fs.readdirSync(folderPath);

            // Buscar archivo main en la carpeta
            const mainFile = filesInFolder.find((file) =>
              ["main.js", "main.bat", "main.py"].includes(file.toLowerCase())
            );

            if (mainFile) {
              const filePath = path.join(folderPath, mainFile);
              const extname = path.extname(mainFile);

              // Solo cargar archivos con extensiones .js
              if (extname === ".js") {
                validModules.push({
                  folder: folder,
                  file: mainFile,
                  path: filePath,
                  type: extname,
                });

                const scriptContent = fs.readFileSync(filePath, "utf-8");
                const moduleWrapper = (function (loadedPreloads) {
                  return function (modules) {
                    eval(scriptContent);
                  };
                })(modules, loadedPreloads, __dirname);

                moduleWrapper(modules);
              } else if (extname === ".bat" || extname === ".py") {
                // Solo advertir sobre archivos bat y py
                console.warn(`Archivo ${extname} encontrado: ${filePath}`);
                validModules.push({
                  folder: folder,
                  file: mainFile,
                  path: filePath,
                  type: extname,
                });
              }
            }
          });

          this.validModules = validModules;
          resolve(); // Opcional: puedes pasar algún valor como resolve(valor)
        } catch (err) {
          reject(err);
        }
      });
    },
    getModules: function () {
      return this.validModules || [];
    },
  },
};

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
    ipcRenderer.on(channel, (event, ...args) => callback(...args)),
});
