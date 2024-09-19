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
  
const configTab = [
    { 'Configuration': '../views/modals/configuration/configView.js' },
];
  // Manejo de eventos para botones de configuración y módulos
  document.getElementById('configButton').addEventListener('click', () => {
    openModal(configTab);
  });
  
const ModulesTabs = [
    { 'Modules': '../views/modals/modules/modulesview.js' }
];

  document.getElementById('modulesButton').addEventListener('click', () => {
    openModal(ModulesTabs);
  });
  