modulesTab = document.getElementById('modules_tab');

// Función para cargar y ejecutar startModule de un módulo
async function loadAndExecuteModule(modulePath) {
  try {
    // Cargar el módulo
    const module = await import(modulePath);

    // Ejecutar la función startModule si está definida
    if (typeof module.startModule === 'function') {
      module.startModule();
      console.log(`startModule called for ${modulePath}`);
    } else {
      console.warn(`startModule is not defined in ${modulePath}`);
    }
  } catch (error) {
    console.error(`Failed to load module ${modulePath}:`, error);
  }
}

function loadModulesAtDOM(modulesArray) {
  modulesTab.innerHTML = '<p class="modulesTitle">Modules</p>';
  console.log(modulesArray);

  modulesArray.forEach(module => {
    const { folder, file } = module;
    const modulePath = `../../../modules/${folder}/${file}`;

    // Agregar el módulo al DOM con un onclick que llama a loadAndExecuteModule
    modulesTab.innerHTML += 
      `<div class="module_template" onclick="loadAndExecuteModule('${modulePath}')">
        <p>${folder}</p>
      </div>`;
  });
}

window.electron.loadModules();

window.electron.onModulesLoaded((modulesList) => {
  loadModulesAtDOM(modulesList);
  console.log('Módulos válidos:', modulesList);
});