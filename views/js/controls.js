const minimizeButton = document.getElementById('minimizeButton')
const resizeButton = document.getElementById('resizeButton')
const closeButton = document.getElementById('closeButton')
const modulesButton = document.getElementById('modulesButton')


document.getElementById('minimizeButton').addEventListener('click', () => {
    window.electron.send('minimize-window');
  });
  
  document.getElementById('resizeButton').addEventListener('click', () => {
    window.electron.send('toggle-window-mode');
  });
  
  document.getElementById('closeButton').addEventListener('click', () => {
    window.electron.send('close-window');
  });
  
  // Manejo de eventos para botones de configuración y módulos
  document.getElementById('configButton').addEventListener('click', () => {
    openModal('../views/modals/configuration/configView.js');
  });
  
  document.getElementById('modulesButton').addEventListener('click', () => {
    openModal('../views/modals/modules/modulesview.js');
  });
  