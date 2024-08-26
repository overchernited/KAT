const PushModal = document.getElementById('modalcontent')

const configTemplate = `<div class="configMainDiv">
  <p class="subdivisionTitle">Terminal Chat</p>
  <div class="subconfig">
    <div class="configSubTitle">
      Theme
      <div class="descriptions" data-key="autoscrollzone" onmousemove="showTooltip(this)" onmouseleave="hideTooltip(event)"> 
        <i class="fa-solid fa-circle-info"></i>
      </div>
    </div>
    <button class="openManagerBtn" onclick="setupFileManager(event)" data-variable="theme" data-type="themes/.css/PrintFile" data-key="select" onmousemove="showTooltip(this)" onmouseleave="hideTooltip(event)"><i class="fa-solid fa-folder"></i></button>
  </div>
  <div class="subconfig">
    <div class="configSubTitle"> 
      Auto-Scroll Zone Size
      <div class="descriptions" data-key="autoscrollzone" onmousemove="showTooltip(this)" onmouseleave="hideTooltip(event)"> 
        <i class="fa-solid fa-circle-info"></i>
      </div>
    </div>
    <input type="range" class="rangeInput" id="scrollzonerange" min="200" max="5000" value="300" step="10"
    oninput="changueAutoScrollZone()">
    <p class="configSubTitle" id="rangeParagraph">300px</p>
  </div>
  <div class="groupbox">
    <div class="descriptions" data-key="alwaysscroll" onmousemove="showTooltip(this)" onmouseleave="hideTooltip(event)"> 
      <i class="fa-solid fa-circle-info"></i>
    </div>
    <p class="boxtitle">Always auto-scroll</p>
    <label class="toggle-box">
      <input class="checkbox" data-variable="AlwaysScroll" type="checkbox" onchange="toggleSlider(this, variableChangeHandler)"
      checked>
      <div class="slider"></div>
  </div>
  <div class="subdivisionTitle">
    Sounds 
    <div class="descriptions" data-key="sounds" onmousemove="showTooltip(this)" onmouseleave="hideTooltip(event)"> 
      <i class="fa-solid fa-circle-info"></i>
    </div>
  </div>
  <div class="sounds">
    <div class="groupbox">
      <button class="openManagerBtn" onclick="setupFileManager(event)" data-variable="createTabSelectedSound" data-type="sounds/.mp3/SelectFile" data-key="select" onmousemove="showTooltip(this)" onmouseleave="hideTooltip(event)"><i class="fa-solid fa-folder"></i></button>
      <p class="boxtitle">Create Tab</p>
      <label class="toggle-box">
        <input class="checkbox" type="checkbox" data-variable="createTabSound" onchange="toggleSlider(this, variableChangeHandler)"
        checked>
        <div class="slider"></div>
      </label>
    </div>
    <div class="groupbox">
      <button class="openManagerBtn" onclick="setupFileManager(event)" data-variable="closeTabSelectedSound" data-type="sounds/.mp3/SelectFile" data-key="select" onmousemove="showTooltip(this)" onmouseleave="hideTooltip(event)"><i class="fa-solid fa-folder"></i></button>
      <p class="boxtitle">Close Tab</p>
      <label class="toggle-box">
        <input class="checkbox" type="checkbox" data-variable="closeTabSound" onchange="toggleSlider(this, variableChangeHandler)"
        checked>
        <div class="slider"></div>
      </label>
    </div>
    <div class="groupbox">
      <button class="openManagerBtn" onclick="setupFileManager(event)" data-variable="dragTabSelectedSound" data-type="sounds/.mp3/SelectFile" data-key="select" onmousemove="showTooltip(this)" onmouseleave="hideTooltip(event)"><i class="fa-solid fa-folder"></i></button>
      <p class="boxtitle">Drag Tab</p>
      <label class="toggle-box">
        <input class="checkbox" type="checkbox" data-variable="dragTabSound" onchange="toggleSlider(this, variableChangeHandler)"
        checked>
        <div class="slider"></div>
      </label>
    </div>
    <div class="groupbox">
      <button class="openManagerBtn" onclick="setupFileManager(event)" data-variable="dropTabSelectedSound" data-type="sounds/.mp3/SelectFile" data-key="select" onmousemove="showTooltip(this)" onmouseleave="hideTooltip(event)"><i class="fa-solid fa-folder"></i></button>
      <p class="boxtitle">Drop Tab</p>
      <label class="toggle-box">
        <input class="checkbox" type="checkbox" data-variable="dropTabSound" onchange="toggleSlider(this, variableChangeHandler)"
        checked>
        <div class="slider"></div>
      </label>
    </div>
    <div class="groupbox">
      <button class="openManagerBtn" onclick="setupFileManager(event)" data-variable="sendMessageSelectedSound" data-type="sounds/.mp3/SelectFile" data-key="select" onmousemove="showTooltip(this)" onmouseleave="hideTooltip(event)"><i class="fa-solid fa-folder"></i></button>
      <p class="boxtitle">Send Message</p>
      <label class="toggle-box">
        <input class="checkbox" type="checkbox" data-variable="sendMessageSound" onchange="toggleSlider(this, variableChangeHandler)"
        checked>
        <div class="slider"></div>
      </label>
    </div>
  </div>
</div>
</div>`

loadCSS('../views/modals/configuration/config.css')
loadScript('../views/modals/configuration/configScript.js')
PushModal.innerHTML += configTemplate
