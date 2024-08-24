const scrollRange = document.getElementById('scrollzonerange')
const rangeParagraph = document.getElementById('rangeParagraph')
const checkboxes = document.querySelectorAll('.checkbox')

const configCloseButton = document.getElementById('configCloseBtn')
const configButton = document.getElementById('configButton')
const configBack =  document.getElementById('katview')
const configModal =  document.getElementById('configModal')

let configOpen =  false;


let configs = {
    createTabSound: JSON.parse(localStorage.getItem('createTabSound')) ?? true,
    closeTabSound: JSON.parse(localStorage.getItem('closeTabSound')) ?? true,
    dragTabSound: JSON.parse(localStorage.getItem('dragTabSound')) ?? true,
    dropTabSound: JSON.parse(localStorage.getItem('dropTabSound')) ?? true,
    sendMessageSound: JSON.parse(localStorage.getItem('sendMessageSound')) ?? true,
    scrollZoneSize: JSON.parse(localStorage.getItem('scrollZoneSize')) ?? 300
};

function closeConfig(){
    configOpen = false
    configBack.style.opacity = '0'
    configModal.style.height = '50'
    configModal.style.width = '50'
    setTimeout(() => {
        configBack.style.display = 'none'
    }, 200);
}

function openConfig(){
    configOpen = true
    configBack.style.display = 'flex'
    configModal.style.height = '50'
    configModal.style.width = '50'
    setTimeout(() => {
        configBack.style.opacity = '1'
        configModal.style.height = '60%'
        configModal.style.width = '50%'
    }, 10);
}

function recoverConfigs(){
    scrollRange.value = configs["scrollZoneSize"]
    rangeParagraph.innerHTML = scrollRange.value + "px"

    checkboxes.forEach(checkbox =>{
        let configname = checkbox.dataset.variable
        checkboxvalue = configs[configname]
        checkbox.checked = checkboxvalue
    })
}

function changueAutoScrollZone(){
    let scrollvalue = scrollRange.value
    rangeParagraph.innerHTML = scrollvalue + "px"
    scrollvalue = parseInt(scrollvalue, 10);
    configs["scrollZoneSize"] = scrollvalue
    localStorage.setItem("scrollZoneSize", scrollvalue);
    console.log(configs["scrollZoneSize"])
}



function soundChangeHandler(slider) {
    var variableToChange = slider.dataset.variable;

    changeSoundValue(variableToChange, slider.checked);
    console.log('Cambio en', variableToChange + ':', configs[variableToChange]);
  }

  function changeSoundValue(variableToChange, newValue) {
    configs[variableToChange] = newValue;
    localStorage.setItem(variableToChange, newValue);
  }

configButton.addEventListener('click', (event) =>{
    if (!configOpen){
        openConfig()
    } else {
        closeConfig()
    }
}) 
configCloseButton.addEventListener('click', closeConfig)

recoverConfigs()