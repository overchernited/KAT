modulesTab = document.getElementById('modules_tab');

function saveModulesState() {
  localStorage.setItem('modulesState', JSON.stringify(modules));
}

// Función para cargar el estado de los módulos desde localStorage
function loadModulesState() {
  const savedState = localStorage.getItem('modulesState');
  if (savedState) {
    Object.assign(modules, JSON.parse(savedState));
  }
}

// Función para cargar y ejecutar startModule de un módulo
async function loadAndExecuteModule(modulePath) {
  try {
    // Extraer el folder del módulo
    const module = Object.values(modules).find(mod => mod.path === modulePath);
    if (!module) {
      throw new Error(`Module not found for path ${modulePath}`);
    }
    const { name: folder } = module;

    // Crear una nueva pestaña antes de ejecutar el módulo
    const newTabIdx = createTab(currentTerminal, folder);

    const moduleScript = await import(modulePath);

    if (typeof moduleScript.startModule === 'function') {
      moduleScript.startModule();
      console.log(`startModule called for ${modulePath}`);

      // Actualizar el estado del módulo
      module.terminalidx = currentTerminal;
      module.tabidx = newTabIdx; // Usar el índice de la nueva pestaña
      module.status = 'running';
      console.log(module);
      updateModuleInDOM(modulePath, 'Stop');
      saveModulesState();
      console.info(`${folder} module running.`)
    } else {
      console.warn(`startModule is not defined in ${modulePath}`);
    }
  } catch (error) {
    console.error(`Failed to load module ${modulePath}:`, error);
  }
}

// Función para detener un módulo
function stopModule(modulePath) {
  // Buscar el módulo en el objeto `modules`
  const moduleState = Object.values(modules).find(mod => mod.path === modulePath);

  if (moduleState) {
    // Detener el módulo asociado a la terminal y pestaña
    const { terminalidx, tabidx } = moduleState;

    closeTab(terminalidx,tabidx)

    // Actualizar el estado del módulo
    moduleState.status = 'stopped';

    // Actualizar el DOM para reflejar el nuevo estado
    updateModuleInDOM(modulePath, 'Run');

    console.log(`Module ${modulePath} stopped`);
    saveModulesState(); // Guardar el estado actualizado
  } else {
    console.error(`Module with path ${modulePath} not found.`);
  }
}

function updateModuleInDOM(modulePath, action) {
  const moduleDiv = document.querySelector(`div[data-path="${modulePath}"]`);
  if (moduleDiv) {
    const module = modules[modulePath];
    if (module) {
      const { name } = module;

      let iconClass = '';
      if (action === 'Run') {
        iconClass = 'fa-play';
      } else if (action === 'Stop') {
        iconClass = 'fa-stop';
      }

      moduleDiv.innerHTML = `
        <p>${name} - ${action}</p>
        <i class="fa-solid ${iconClass}"></i>
      `;

      moduleDiv.setAttribute('onclick', `handleModuleClick('${modulePath}', '${action}')`);
    } else {
      console.error(`Module with path ${modulePath} not found in modules.`);
    }
  }
}

function handleModuleClick(modulePath, action) {
  if (action === 'Run') {
    loadAndExecuteModule(modulePath);
  } else if (action === 'Stop') {
    stopModule(modulePath);
  }
}

// Función para cargar los módulos en el DOM
function loadModulesAtDOM(modulesArray) {
  modulesTab.innerHTML = '';
  console.log(modulesArray);

  // Cargar módulos desde el array y verificar estado
  modulesArray.forEach(module => {
    const { folder, file } = module;
    const modulePath = `../../../modules/${folder}/${file}`;

    // Inicializar el estado del módulo
    if (!modules[modulePath]) {
      modules[modulePath] = {
        name: folder,
        path: modulePath,
        status: 'stopped',
        terminalidx: null,
        tabidx: null
      };
    }

    const moduleState = modules[modulePath];

    // Verificar si la terminal y la pestaña están abiertas
    const terminalOpen = terminalsdict[moduleState.terminalidx] && terminalsdict[moduleState.terminalidx].tabsContent[moduleState.tabidx];
    if (!terminalOpen) {
      moduleState.status = 'stopped';
      moduleState.terminalidx = null;
      moduleState.tabidx = null;
    }

    // Determinar la acción actual en función del estado del módulo
    const action = moduleState.status === 'stopped' ? 'Run' : 'Stop';

    // Determinar el ícono a mostrar
    const iconClass = action === 'Run' ? 'fa-play' : 'fa-stop';

    // Agregar el módulo al DOM
    modulesTab.innerHTML += 
      `<div class="module_template" data-path="${modulePath}" onclick="handleModuleClick('${modulePath}', '${action}')">
        <p>${moduleState.name} - ${action}</p>
        <i class="fa-solid ${iconClass}"></i>
      </div>`;
  });
}

window.electron.loadModules();

window.electron.onModulesLoaded((modulesList) => {
  loadModulesAtDOM(modulesList);
  console.log('Módulos válidos:', modulesList);
});