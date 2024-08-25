const tooltipDiv = document.getElementById("tooltipDiv");
let tooltiped = false;

const defaultConfigs = {
  createTabSound: true,
  closeTabSound: true,
  dragTabSound: true,
  dropTabSound: true,
  sendMessageSound: true,
  scrollZoneSize: 300,
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
};



const descriptions = {
  terminalchat: "Contenido largo y detallado del Tooltip 1.",
  soundselect: "Select a sound",
  sounds:
    "La configuracion sobre los sonidos que se ejecutan al realizar ciertas acciones dentro de la terminal",
  autoscrollzone:
    "The Auto-Scroll Zone Size setting allows adjusting the automatic scrolling of content when the user approaches a certain distance from the bottom of the chat.",
};


const managerFiles = [
  {
    themesRepositoryGroup:{
      "Themes":{
        category: "yellow"
      }
    },
    soundsRepositoryGroup:{
      "Create Tab":{
        category: "green"
      },
      "Close Tab":{
        category: "red"
      },
      "Drag Tab":{
        category: "blue"
      },
      "Drop Tab":{
        category: "purple"
      },
      "Send Message":{
        category: "yellow"
      }
    },
    soundsRepository: {
      "Sound1": {
        path: "Sound1.mp3",
        category: "blue"
      },
      "Sound2": {
        path: "Sound2.mp3",
        category: "blue"
      },
      "Sound3": {
        path: "Sound3.mp3",
        category: "blue"
      },
      "Sound4": {
        path: "Sound4.mp3",
        category: "blue"
      },
      "Sound5": {
        path: "Sound5.mp3",
        category: "purple"
      },
      "Sound6": {
        path: "Sound6.mp3",
        category: "purple"
      },
      "Sound7": {
        path: "Sound7.mp3",
        category: "purple"
      },
      "Sound8": {
        path: "Sound8.mp3",
        category: "purple"
      }
    },
    themesRepository: {
      "Theme1":{
        path: "/ruta",
        category: "yellow"
      }
    }
  }
];


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


function soundRep(soundname) {
  var soundpath = "./sounds/" + soundname;
  var audio = new Audio(soundpath);
  audio.play();
}

function toggleSlider(slider, action) {
  effectsound = slider.checked
    ? "./sounds/Sound8.mp3"
    : "./sounds/Sound8.mp3";
  var effect = new Audio(effectsound);
  effect.play();

  action(slider);
}

function showTooltip(element) {
  if (tooltiped == false) {
    tooltipDiv.style.display = "block";
    setTimeout(() => {
      tooltipDiv.classList.add('tooltiped')
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
  tooltiped = true
}

function hideTooltip(event) {
  if (tooltiped == true) {
    const tooltipHeight = tooltipDiv.offsetHeight;
    tooltipDiv.style.top = `${event.clientY - tooltipHeight}px`;
    tooltipDiv.style.opacity = "0"
    
    setTimeout(() => {
      tooltipDiv.style.display = 'none'
      tooltiped = false
    }, 85);
  }
}
