modulesTab = document.getElementById('modules_tab');


function loadModulesAtDOM(modulesArray) {
    modulesTab.innerHTML = '<p class="modulesTitle">Modules</p>' 
    modulesArray.forEach(module => {
        modulesTab.innerHTML += 
        `<div class="module_template">
        <p>${module.folder}</p>
        </div>`; // Limpiar el contenedor de módulos existentes
    });
}

console.log('xd')
window.electron.loadModules();

window.electron.onModulesLoaded((modulesList) => {
  loadModulesAtDOM(modulesList);
  console.log('Módulos válidos:', modulesList);
});