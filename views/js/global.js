const tooltipDiv = document.getElementById("tooltipDiv");
let tooltiped = false;

const defaultConfigs = {
  createTabSound: true,
  closeTabSound: true,
  dragTabSound: true,
  dropTabSound: true,
  sendMessageSound: true,
  AlwaysScroll: false,
  scrollZoneSize: 300,
  selectedTheme: "default.css",
};

const defaultSounds = {
  createTabSelectedSound: "Sound2.mp3",
  closeTabSelectedSound: "Sound1.mp3",
  dragTabSelectedSound: "Sound3.mp3",
  dropTabSelectedSound: "Sound4.mp3",
  sendMessageSelectedSound: "Sound5.mp3",
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
};

const descriptions = {
  terminalchat: "Contenido largo y detallado del Tooltip 1.",
  select: "Select a file",
  sounds:
    "La configuracion sobre los sonidos que se ejecutan al realizar ciertas acciones dentro de la terminal",
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
  theme = document.getElementById('theme')
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
  theme = document.getElementById('theme')
  console.log(folder);
  selectedFiles[filevariable] = file;
  console.log(filevariable, file)
  localStorage.setItem(filevariable, JSON.stringify(file));
  theme.href = `../themes/${file}`
}


window.addEventListener('load', function() {
  // Llamar al método loadModules de electron cuando la página se ha cargado
  window.electron.loadModules();
});



window.electron.onModulesLoaded((modulesList) => {
  // Imprimir los módulos válidos para verificar
  console.log('Módulos válidos:', modulesList);

  // Verificar si el modal está cerrado antes de ejecutar los scripts
  if (!modalOpen) {
    // Procesar cada módulo
    modulesList.forEach((module) => {
      const { scriptContent, folder, file } = module;
      
      // Imprimir el nombre del módulo y el contenido del script
      console.log(`Ejecutando script del módulo: ${folder}/${file}`);
      
      try {
        eval(scriptContent);
        console.log(`El módulo ${folder}/${file} se ejecutó con éxito.`);
      } catch (error) {
        console.error(`Error al ejecutar el módulo ${folder}/${file}:`, error);
      }
    });
  }
});

recoverTheme()