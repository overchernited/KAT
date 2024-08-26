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
const path = require("path");

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    frame: false,
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

  globalShortcut.register("CommandOrControl+W", () => {
    win.webContents.send("closeTab");
  });

  // win.maximize();
  win.loadFile("views/index.html");

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
    console.log("Servidor Cerrado");
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
    console.log("xd2");
    const moduleFolderPath = path.join(__dirname, "modules");
    const validModules = [];

    try {
      console.log("Cargando módulos desde:", moduleFolderPath);
      fs.readdirSync(moduleFolderPath).forEach((folder) => {
        const folderPath = path.join(moduleFolderPath, folder);
        console.log("Examinando carpeta:", folderPath);

        if (fs.statSync(folderPath).isDirectory()) {
          const filesInFolder = fs.readdirSync(folderPath);
          const mainFile = filesInFolder.find((file) =>
            ["main.js", "main.bat", "main.py"].includes(file.toLowerCase())
          );

          if (mainFile) {
            const filePath = path.join(folderPath, mainFile);
            const extname = path.extname(mainFile);

            if ([".js", ".bat", ".py"].includes(extname)) {
              validModules.push({
                folder: folder,
                file: mainFile,
                path: filePath,
                type: extname,
              });
              console.log(
                "Módulo válido encontrado:",
                validModules[validModules.length - 1]
              );
            }
          }
        }
      });

      console.log("Módulos válidos:", validModules);
      event.sender.send("modulesLoaded", validModules);
    } catch (error) {
      console.error("Error al cargar módulos:", error);
    }
  });

  ipcMain.on("loadFiles", (event, { folderName, validExtensions }) => {
    console.log("Cargando archivos...");
    
    // Construye la ruta completa a partir del directorio actual y el nombre de la carpeta
    const folderPath = path.join(__dirname, folderName);
    const validFiles = [];
  
    try {
      console.log("Cargando archivos desde:", folderPath);
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
            "Archivo válido encontrado:",
            validFiles[validFiles.length - 1]
          );
        }
      });
  
      console.log("Archivos válidos:", validFiles);
      event.sender.send("filesLoaded", validFiles);
    } catch (error) {
      console.error("Error al cargar archivos:", error);
    }
  });
}

ipcMain.on("run-cmd", (event, { command, idx }) => {
  const cmd = spawn(command, { shell: true });

  let output = "";
  cmd.stdout.on("data", (data) => {
    output += data.toString();
  });

  cmd.stderr.on("data", (data) => {
    output += `Error: ${data.toString()}`;
  });

  cmd.on("close", (code) => {
    event.reply("cmd-output", { type: "info", idx, message: output });
  });
});

app.whenReady().then(() => {
  createWindow();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
1;
