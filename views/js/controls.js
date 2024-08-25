const minimizeButton = document.getElementById('minimizeButton')
const resizeButton = document.getElementById('resizeButton')
const closeButton = document.getElementById('closeButton')


minimizeButton.addEventListener('click', () =>{ window.modules.api.send('minimize-window') }) 
resizeButton.addEventListener('click', () =>{ window.modules.api.send('toggle-window-mode') }) 
closeButton.addEventListener('click', () =>{ window.modules.api.send('close-window') }) 
configButton.addEventListener("click", () =>{ openModal('../views/modals/configuration/configview.js') });