const { contextBridge, ipcRenderer, globalShortcut } = require('electron');
const { exec } = require('child_process');
const fs = require('fs');
const net = require('net');
const path = require('path');
const { spawn } = require('child_process');
const { rejects } = require('assert');

const modules = {
  api: {
    send: (channel, data) => {
      ipcRenderer.send(channel, data);
    },
  },

  py: {
    exec: function (scriptName ,scriptPath, onstdout, onstderr, onstclose) {
      const pythonProcess = spawn(scriptName, [scriptPath]);

      pythonProcess.stdout.on('data', (data) => {
        onstdout(data)
      });

      pythonProcess.stderr.on('data', (data) => {
        onstderr(data)
      });

      pythonProcess.on('close', (code) => {
        onstclose(code)
      });
    }
  },

  // Llama a la función con la ruta de tu script de Python

  katmodules: {
    moduleFolderPath: path.join(__dirname, 'modules'),
    loadModules: function (modules, loadedPreloads) {
      return new Promise((resolve, reject) => {
        try {
          this.moduleFolders = fs.readdirSync(this.moduleFolderPath);
          const moduleFolderPath = this.moduleFolderPath;
          const moduleFolders = this.moduleFolders;

          moduleFolders.forEach(folder => {
            const folderPath = path.join(moduleFolderPath, folder);
            const filesInFolder = fs.readdirSync(folderPath);

            filesInFolder.forEach(file => {
              if (path.extname(file) === '.js') {
                const filePath = path.join(folderPath, file);
                const scriptContent = fs.readFileSync(filePath, 'utf-8');
                const moduleWrapper = (function (loadedPreloads) {
                  return function (modules) {
                    eval(scriptContent);
                  };
                })(modules, loadedPreloads, __dirname);

                moduleWrapper(modules);
              }
            });
          });
          resolve(); // Opcional: puedes pasar algún valor como resolve(valor)
        } catch (err) {
          reject(err);
        }
      });
    },
    getModules: function () {
      return this.moduleFolders;
    },
  },

  netModule: {
    client: null,

    connectServer: function (api) {
      const host = '127.0.0.1';
      const port = 6666;

      this.client = new net.Socket();

      this.client.connect(port, host, () => {
        console.log(`[Web] Connected to ${host}:${port} (Python Server)`);
      });

      this.client.on('data', (data) => {
        console.log(`[Web] Message from server: ${data}`);
      });

      this.client.on('close', () => {
        api.send('close-window');
      });
    },

    closeServer: function (api) {
      if (this.client) {
        this.client.write('close');
        console.log('Closed Status');
      } else {
        api.send('close-window');
      }
    },
  },

  readfile: fs,
}

let loadedPreloads = {};

function loadModulesPreloads(basePath) {
  return new Promise((resolve, reject) => {
    const moduleFolders = fs.readdirSync(basePath);
    const promises = []; // Almacenar las promesas generadas

    moduleFolders.forEach(moduleFolder => {
      const moduleFolderPath = path.join(basePath, moduleFolder);
      const preloadsFolderPath = path.join(moduleFolderPath, 'preloads');

      if (fs.existsSync(preloadsFolderPath)) {
        const preloadfiles = fs.readdirSync(preloadsFolderPath);

        preloadfiles.forEach(file => {
          if (path.extname(file) === '.js') {
            const filePath = path.join(preloadsFolderPath, file);
            const scriptContent = fs.readFileSync(filePath, 'utf-8');
            try {
              const precharge = eval(scriptContent);
              loadedPreloads[file.split('.')[0]] = precharge;
              contextBridge.exposeInMainWorld('loadedPreloads', loadedPreloads);
            } catch (error) {
              console.error(`Error al evaluar el archivo ${file}:`, error);
            }
          }
        });
      }
      promises.push(Promise.resolve(loadedPreloads));
    });

    Promise.all(promises)
      .then(() => resolve(loadedPreloads))
      .catch(error => reject(error));
  });
}

loadModulesPreloads(path.join(__dirname, 'modules'))
  .then((loadedPreloads) => {
    contextBridge.exposeInMainWorld('modules', modules);
    modules.katmodules.loadModules(modules, loadedPreloads)
      .then(() => {
        window.onload = function () {
          window.dispatchEvent(new Event('modulesLoaded'));
        }
      })
  })

ipcRenderer.on('closeTab', (event, message) => {
  window.dispatchEvent(new Event('closeTab'));
});


ipcMain.on('run-cmd', (event, command) => {
  exec(command, (error, stdout, stderr) => {
    if (error) {
      event.reply('cmd-output', `Error: ${error.message}`);
      return;
    }
    if (stderr) {
      event.reply('cmd-output', `Stderr: ${stderr}`);
      return;
    }
    event.reply('cmd-output', stdout);
  });
});