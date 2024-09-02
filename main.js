const {
  app,
  BrowserWindow,
  ipcMain,
  Menu,
  MenuItem,
  globalShortcut,
} = require("electron");
const fs = require("fs");
const { spawn } = require("child_process");
const { exec } = require("child_process");
const path = require("path");

const os = require("os");
const shells = {};
const lastCommand = {};

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    frame: false,
    icon: path.join(__dirname, "icon.ico"),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
    },
    margin: 0,
    padding: 0,
  });

  win.setMinimumSize(800, 600);

  const contextMenu = new Menu();

  win.webContents.on("context-menu", (event, params) => {
    contextMenu.popup(win, params.x, params.y);
  });

  globalShortcut.register("CommandOrControl+W", () => {});

  // win.maximize();
  win.loadFile("views/index.html");

  ipcMain.on("create-new-window", (event, arg) => {
    createWindow();
  });

  ipcMain.on("minimize-window", () => {
    win.minimize();
  });

  ipcMain.on("toggle-window-mode", () => {
    if (win.isMaximized()) {
      win.unmaximize();
    } else {
      win.maximize();
    }
  });

  ipcMain.on("close-window", () => {
    closeAllShells()
    win.close();
  });

  ipcMain.on("devtools", () => {
    if (win.webContents.isDevToolsOpened()) {
      win.webContents.closeDevTools();
    } else {
      win.webContents.openDevTools();
    }
  });

  ipcMain.on("loadModules", (event) => {
    const moduleFolderPath = path.join(__dirname, "modules");
    const validModules = [];

    try {
      // console.log("Cargando módulos desde:", moduleFolderPath);
      fs.readdirSync(moduleFolderPath).forEach((folder) => {
        const folderPath = path.join(moduleFolderPath, folder);
        // console.log("Examinando carpeta:", folderPath);

        if (fs.statSync(folderPath).isDirectory()) {
          const filesInFolder = fs.readdirSync(folderPath);
          const mainFile = filesInFolder.find(
            (file) => file.toLowerCase() === "main.js"
          );

          if (mainFile) {
            const filePath = path.join(folderPath, mainFile);
            const extname = path.extname(mainFile);

            if (extname === ".js") {
              const scriptContent = fs.readFileSync(filePath, "utf-8");

              validModules.push({
                folder: folder,
                file: mainFile,
                path: filePath,
                type: extname,
                scriptContent: scriptContent,
              });
              // console.log(
              //   "Módulo válido encontrado:",
              //   validModules[validModules.length - 1]
              // );
            }
          }
        }
      });

      // console.log("Valid Modules", validModules);
      event.sender.send("modulesLoaded", validModules);
    } catch (error) {
      // console.error("Error while loading modules:", error);
    }
  });

  ipcMain.on("loadFiles", (event, { folderName, validExtensions }) => {
    const folderPath = path.join(__dirname, folderName);
    const validFiles = [];

    try {
      console.log("Loading Files from:", folderPath);
      fs.readdirSync(folderPath).forEach((file) => {
        const filePath = path.join(folderPath, file);
        const extname = path.extname(file).toLowerCase();

        if (
          fs.statSync(filePath).isFile() &&
          validExtensions.includes(extname)
        ) {
          validFiles.push({
            file: file,
            path: filePath,
          });
          console.log(
            // "Archivo válido encontrado:",
            validFiles[validFiles.length - 1]
          );
        }
      });

      // console.log("Files", validFiles);
      event.sender.send("filesLoaded", validFiles);
    } catch (error) {
      console.error("Error while loading files", error);
    }
  });
}
// Determinar el shell adecuado según el sistema operativo

const getShellCommand = () => {
  if (os.platform() === "win32") {
    return "cmd.exe";
  } else {
    return "bash"; // Para sistemas Unix-like (Linux, macOS)
  }
};
// Comando para iniciar una nueva shell
const getShellArgs = () => {
  if (os.platform() === "win32") {
    return ["@ECHO OFF"]; // Para cmd.exe
  } else {
    return ["bash"]; // Para bash
  }
};

ipcMain.on("edit-shell", (event, { shellid, terminalidx, tabidx }) => {
  // Verificar si el shellid principal existe
  if (shells[shellid]) {
    // Actualizar la terminal y pestaña asociada
    shells[shellid].terminalidx = terminalidx;
    shells[shellid].tabidx = tabidx;

    console.log(`Shell ${shellid} actualizado con terminalidx: ${terminalidx} y tabidx: ${tabidx}`);
  } else {
    console.log(`Shell ${shellid} no encontrado.`);
  }

  // Construir el key del shell con el prefijo 'py-'
  const pyShellid = 'py-' + shellid;
  
  // Verificar y actualizar shells con el prefijo 'py-' seguido del shellid
  if (shells[pyShellid]) {
    shells[pyShellid].terminalidx = terminalidx;
    shells[pyShellid].tabidx = tabidx;

    console.log(`Shell ${pyShellid} actualizado con terminalidx: ${terminalidx} y tabidx: ${tabidx}`);
  } else {
    console.log(`Shell ${pyShellid} no encontrado.`);
  }
});

ipcMain.on("start-shell", (event, { shellid, tabidx, terminalidx }) => {
  console.log('Started shell:' + shellid);

  if (shells[shellid]) {
    event.reply("shell-output", {
      type: "info",
      terminalidx,
      tabidx,
      message: "Shell ya está en ejecución.",
    });
    return;
  }

  const shellCommand = getShellCommand();
  const shellArgs = getShellArgs();
  const shell = spawn(shellCommand, shellArgs, { shell: true });

  // Guardar la terminal y pestaña asociada en el objeto shell
  const shellObject = {
    terminalidx,
    tabidx,
    process: shell,
    lastCommand: ''
  };

  shells[shellid] = shellObject;

  shell.stdout.on("data", (data) => {
    let output = data.toString();
    const { lastCommand } = shells[shellid];

    // Elimina el comando de la salida si está presente al principio
    if (output.startsWith(lastCommand)) {
      output = output.substring(lastCommand.length).trim();
      shells[shellid].lastCommand = ''; // Reset lastCommand after it has been removed
    }

    // Si la salida no está vacía, envíala
    if (output.trim()) {
      const { terminalidx, tabidx } = shells[shellid];
      event.reply("shell-output", {
        type: "info",
        terminalidx,
        tabidx,
        message: output,
      });
    }
  });

  shell.stderr.on("data", (data) => {
    const { terminalidx, tabidx } = shells[shellid];
    event.reply("shell-output", {
      type: "error",
      terminalidx,
      tabidx,
      message: data.toString(),
    });
  });

  shell.on("close", (code) => {
    delete shells[shellid];
    console.log(`Shell ${shellid} closed with code ${code}`);
  });

  shell.on("error", (error) => {
    const { terminalidx, tabidx } = shells[shellid];
    event.reply("shell-output", {
      type: "error",
      terminalidx,
      tabidx,
      message: `Error initializing shell process: ${error.message}`,
    });
    delete shells[shellid];
  });

  if (os.platform() === "win32") {
    runCmd({ command: "@ECHO OFF", shellid });
  } else {
    runCmd({ command: "", shellid });
  }
});

ipcMain.on("run-cmd", (event, { command, shellid }) => {
  const shellObject = shells[shellid];

  if (!shellObject || !shellObject.process) {
    console.log(`Shell with ${shellid} id not found.`);
    return;
  }

  // Establecer el comando actual para referencia futura
  shellObject.lastCommand = command;

  // Ejecutar el comando en el proceso asociado
  shellObject.process.stdin.write(command + '\n');
});


function runCmd({ command, shellid }) {
  const shell = shells[shellid];

  if (shell) {
    shell.process.stdin.write(`${command}\n`);
  } else {
    console.error(`No shell found for idx ${shellid}`);
  }
}


function closeAllShells() {
  for (const idx in shells) {
    if (shells.hasOwnProperty(idx)) {
      const shellObject = shells[idx];
      const process = shellObject.process; // Accede a la shell real

      if (process && typeof process.kill === 'function') {
        process.kill();  // Envía una señal para terminar el proceso
        console.log(`Shell ${idx} stopped`);
        delete shells[idx];  // Elimina la referencia del proceso
      }
    }
  }
}

ipcMain.on('close-all', (event) => {
  closeAllShells()
});

ipcMain.on("stop-shell", (event, { shellid }) => {
  // Cierra la shell con el shellid especificado
  const shell = shells[shellid];
  if (shell) {
    shell.process.kill(); // Cierra la entrada estándar de la shell
    delete shells[shellid]; // Elimina la shell de la lista
  } else {
    console.log(`Shell ${shellid} not founded.`);
  }

  // Cierra cualquier shell con el prefijo 'py' seguido del shellid
  const pyShellId = `py-${shellid}`;
  const pyShell = shells[pyShellId];
  if (pyShell) {
    pyShell.process.kill(); // Cierra la entrada estándar de la shell
    delete shells[pyShellId]; // Elimina la shell de la lista
    console.log(`Shell ${pyShellId} stopped`);
  } else {
    console.log(`Shell ${pyShellId} not founded.`);
  }
});

ipcMain.on("run-python", (event, { scriptPath, shellid, tabidx, terminalidx }) => {
  console.log(`Started shell: ${shellid}`);

  if (shells[shellid]) {
    console.log("Already in execution")
    return;
  }

  const shell = spawn('python', ['-u', scriptPath]);

  // Guardar la shell y sus propiedades en el objeto shells
  const shellObject = {
    tabidx,
    terminalidx,
    process: shell,
  };

  shells[shellid] = shellObject;

  shell.stdout.on("data", (data) => {
    const { terminalidx, tabidx } = shells[shellid];
    console.log(terminalidx, tabidx)
    let output = data.toString();
    console.log()

    if (output.trim()) {
      event.reply("shell-output", {
        type: "info",
        tabidx,
        terminalidx,
        message: output,
      });
    }
  });

  shell.stderr.on("data", (data) => {
    const { terminalidx, tabidx } = shells[shellid];
    event.reply("shell-output", {
      type: "error",
      tabidx,
      terminalidx,
      message: data.toString(),
    });
  });

  shell.on("close", (code) => {
    delete shells[shellid];
    console.log(`Shell ${shellid} closed with code ${code}`);
  });

  shell.on("error", (error) => {
    const { terminalidx, tabidx } = shells[shellid];
    event.reply("shell-output", {
      type: "error",
      tabidx,
      terminalidx,
      message: `Error initializing shell process: ${error.message}`,
    });
    delete shells[shellid];
  });
});

app.whenReady().then(() => {
  createWindow();
});

app.on("will-quit", () => {
  globalShortcut.unregisterAll();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
