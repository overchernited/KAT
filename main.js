const { app, BrowserWindow, ipcMain, Menu, MenuItem, globalShortcut } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    frame: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    margin: 0,
    padding: 0
  });


  win.setMinimumSize(800, 600);

  const contextMenu = new Menu();

  win.webContents.on('context-menu', (event, params) => {
    contextMenu.popup(win, params.x, params.y);
  });

  globalShortcut.register('CommandOrControl+W', () => {
    win.webContents.send('closeTab');
});

  // win.maximize();
  win.loadFile('views/index.html');

  ipcMain.on('minimize-window', () => {
    win.minimize();
  });

  ipcMain.on('toggle-window-mode', () => {
    if (win.isMaximized()) {
      win.unmaximize();
    } else {
      win.maximize();
    }
  });

  ipcMain.on('close-window', () => {
    console.log('Servidor Cerrado')
    win.close();
  });

  ipcMain.on('devtools', () => {
    if (win.webContents.isDevToolsOpened()) {
      win.webContents.closeDevTools();
    } else {
      win.webContents.openDevTools();
    }
  })
}





app.whenReady().then(() => {
    createWindow();
  })

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  }); 1
