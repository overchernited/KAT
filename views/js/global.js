const tooltipDiv = document.getElementById("tooltipDiv");
let tooltiped = false;

const v = "v1.0";

document.getElementById("version").innerText = v;
const defaultConfigs = {
  createTabSound: true,
  closeTabSound: true,
  dragTabSound: true,
  dropTabSound: true,
  onStartSound: true,
  sendMessageSound: true,
  AlwaysScroll: false,
  scrollZoneSize: 300,
  selectedTheme: "Supernova (Dark Theme).css",
};

const defaultSounds = {
  createTabSelectedSound: "Sound2.mp3",
  closeTabSelectedSound: "Sound1.mp3",
  dragTabSelectedSound: "Sound3.mp3",
  dropTabSelectedSound: "Sound4.mp3",
  sendMessageSelectedSound: "Sound5.mp3",
  onStartSelectedSound: "Sound9.mp3",
};

let configs = {
  createTabSound: getItem("createTabSound", defaultConfigs.createTabSound),
  closeTabSound: getItem("closeTabSound", defaultConfigs.closeTabSound),
  dragTabSound: getItem("dragTabSound", defaultConfigs.dragTabSound),
  dropTabSound: getItem("dropTabSound", defaultConfigs.dropTabSound),
  sendMessageSound: getItem(
    "sendMessageSound",
    defaultConfigs.sendMessageSound
  ),
  scrollZoneSize: getItem("scrollZoneSize", defaultConfigs.scrollZoneSize),
  AlwaysScroll: getItem("AlwaysScroll", defaultConfigs.AlwaysScroll),
  onStartSound: getItem("onStartSound", defaultConfigs.onStartSound),
};

const selectedFiles = {
  createTabSelectedSound: getItem(
    "createTabSelectedSound",
    defaultSounds.createTabSelectedSound
  ),
  closeTabSelectedSound: getItem(
    "closeTabSelectedSound",
    defaultSounds.closeTabSelectedSound
  ),
  dragTabSelectedSound: getItem(
    "dragTabSelectedSound",
    defaultSounds.dragTabSelectedSound
  ),
  dropTabSelectedSound: getItem(
    "dropTabSelectedSound",
    defaultSounds.dropTabSelectedSound
  ),
  sendMessageSelectedSound: getItem(
    "sendMessageSelectedSound",
    defaultSounds.sendMessageSelectedSound
  ),
  selectedTheme: getItem("selectedTheme", defaultConfigs.selectedTheme),
  onStartSelectedSound: getItem(
    "onStartSelectedSound",
    defaultSounds.onStartSelectedSound
  ),
};

const descriptions = {
  terminalchat: "Contenido largo y detallado del Tooltip 1.",
  select: "Select a file",
  themeconfig:
    "Select a css file theme to personalize the terminal colors, shapes, etc",
  sounds:
    "Configurations about sounds that plays realizing certain actions in the terminal.",
  autoscrollzone:
    "The Auto-Scroll Zone Size setting allows adjusting the automatic scrolling of content when the user approaches a certain distance from the bottom of the chat.",
  alwaysscroll:
    'The Always-Scroll option, disables the "Auto-Scroll Zone Size" setting, by scrolling automatic to the bottom of the chat forever.',
};

function getItem(key, defaultValue) {
  const storedValue = localStorage.getItem(key);
  try {
    const parsedValue = JSON.parse(storedValue);
    console.log(storedValue);

    return parsedValue !== null ? parsedValue : defaultValue;
  } catch {
    return defaultValue;
  }
}

function recoverConfigs() {
  scrollRange.value = configs["scrollZoneSize"];
  rangeParagraph.innerHTML = scrollRange.value + "px";

  checkboxes.forEach((checkbox) => {
    let configname = checkbox.dataset.variable;
    checkboxvalue = configs[configname];
    checkbox.checked = checkboxvalue;
  });
}

function recoverTheme() {
  theme = document.getElementById("theme");
  theme.href = `../themes/${selectedFiles["selectedTheme"]}`;
}

function soundRep(soundname) {
  var soundpath = "../sounds/" + soundname;
  var audio = new Audio(soundpath);
  audio.play();
}

function toggleSlider(slider, action) {
  effectsound = slider.checked;
  soundRep("Sound8.mp3");

  action(slider);
}

function showTooltip(element) {
  if (tooltiped == false) {
    tooltipDiv.style.display = "block";
    setTimeout(() => {
      tooltipDiv.classList.add("tooltiped");
      tooltipDiv.style.opacity = "1";
    }, 5);

    const key = element.dataset.key;
    const content = descriptions[key] || "";

    tooltipDiv.innerHTML = content;

    const tooltipHeight = tooltipDiv.offsetHeight;
    const tooltipWidth = tooltipDiv.offsetWidth;

    const cursorX = event.clientX;
    const cursorY = event.clientY;

    tooltipDiv.style.top = `${cursorY - tooltipHeight}px`;
    tooltipDiv.style.left = `${cursorX + 10}px`;
  }
  tooltiped = true;
}

function hideTooltip(event) {
  if (tooltiped == true) {
    const tooltipHeight = tooltipDiv.offsetHeight;
    tooltipDiv.style.top = `${event.clientY - tooltipHeight}px`;
    tooltipDiv.style.opacity = "0";

    setTimeout(() => {
      tooltipDiv.style.display = "none";
      tooltiped = false;
    }, 85);
  }
}

function loadTheme(event, filevariable, file, path, folder) {
  theme = document.getElementById("theme");
  console.log(folder);
  selectedFiles[filevariable] = file;
  console.log(filevariable, file);
  localStorage.setItem(filevariable, JSON.stringify(file));
  theme.href = `../themes/${file}`;
}

function OnStart() {
  recoverTheme();
  if (configs["onStartSound"] == true) {
    soundRep(selectedFiles["onStartSelectedSound"]);
  }
}

async function loadView(view) {
  const response = await fetch(view);
  const viewScript = await response.text();
  eval(viewScript);
}

function loadCSS(href) {
  // Crear una URL base a partir del documento actual
  const baseUrl = new URL(document.baseURI);

  // Convertir el href relativo a una URL absoluta
  const absoluteHref = new URL(href, baseUrl).href;

  // Verificar si el CSS ya está cargado
  const links = document.querySelectorAll('link[rel="stylesheet"]');
  for (const linkElement of links) {
    if (linkElement.href === absoluteHref) {
      console.log(`${href} is already loaded`);
      return; // Salir si el CSS ya está cargado
    }
  }

  // Crear y agregar el nuevo CSS
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = absoluteHref;

  document.head.appendChild(link);
}

function loadScript(type, src) {
  // Crear una URL base a partir del documento actual
  const baseUrl = new URL(document.baseURI);

  // Convertir el src relativo a una URL absoluta
  const absoluteSrc = new URL(src, baseUrl).href;

  // Verificar si el script ya está cargado
  const scripts = document.querySelectorAll('script');
  for (const scriptElement of scripts) {
    if (scriptElement.src === absoluteSrc) {
      console.log(`${src} is already loaded, removing and reloading`);
      
      // Eliminar el script existente
      scriptElement.parentNode.removeChild(scriptElement);
      
      // Crear y agregar el nuevo script
      const script = document.createElement('script');
      script.type = type;
      script.src = absoluteSrc;
      script.onload = () => console.log(`${src} loaded successfully`);
      script.onerror = () => console.error(`Failed to load ${src}`);

      document.head.appendChild(script);
      return;
    }
  }

  // Crear y agregar el nuevo script si no estaba previamente cargado
  const script = document.createElement('script');
  script.type = type;
  script.src = absoluteSrc;
  script.onload = () => console.log(`${src} loaded successfully`);
  script.onerror = () => console.error(`Failed to load ${src}`);

  document.head.appendChild(script);
}

window.addEventListener("load", function () {
  OnStart();
  setTimeout(() => {
    window.electron.loadModules();
  }, 500);
});

window.electron.onModulesLoaded(async (modulesList) => {
  // Array para almacenar las promesas de carga de módulos
  const modulePromises = modulesList.map(async (module) => {
    const { folder, file } = module;

    // Construir la ruta del módulo
    const modulePath = `../../modules/${folder}/${file}`;

    if (!modalOpen){
      try {
        // Importar el módulo dinámicamente
        const module = await import(modulePath);
  
        // Verificar si initModule está definida en el módulo importado y ejecutarla
        if (typeof module.initModule === 'function') {
          module.initModule(); // Ejecuta la función si está definida
          console.log(`initModule executed for ${modulePath}`);
        } else {
          console.warn(`initModule is not defined in ${modulePath}`);
        }
      } catch (error) {
        console.error(`Error loading module ${modulePath}:`, error);
      }
    }
  });

  // Esperar a que todos los módulos se carguen y se ejecute initModule
  await Promise.all(modulePromises);

  // Ejecutar onStart después de procesar todos los módulos
  let loadingPage = document.getElementById("loadingPage");
  if (loadingPage) {
    loadingPage.style.opacity = "0";
    loadingPage.style.visibility = "hidden";
  } else {
    console.warn("Loading page element not found.");
  }
});

window.electron.startShell("main", "1", "1");