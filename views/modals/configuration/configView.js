const PushModal = document.getElementById('modalcontent')

const configTemplate = ` 
<p class="configTitle">Global Configurations</p>
      <p class="subdivisionTitle">Terminal Chat</p>
      <div class="subconfig">
        <div class="configSubTitle">
          Auto-Scroll Zone Size
          <div class="descriptions" data-key="autoscrollzone" onmousemove="showTooltip(this)" onmouseleave="hideTooltip(event)"> 
            <i class="fa-solid fa-circle-info"></i>
          </div>
        </div>
        <input type="range" class="rangeInput" id="scrollzonerange" min="200" max="600" value="300" step="10"
          oninput="changueAutoScrollZone()">
        <p class="configSubTitle" id="rangeParagraph">300px</p>
      </div>
      <div class="subdivisionTitle">
        Sounds 
        <div class="descriptions" data-key="sounds" onmousemove="showTooltip(this)" onmouseleave="hideTooltip(event)"> 
          <i class="fa-solid fa-circle-info"></i>
        </div>
      </div>
      <div class="sounds">
        <div class="sound">
          <button class="openManagerBtn" onclick="setupFileManager(event)" data-type="soundsRepository" data-variable="createTabSelectedSound" data-key="soundselect" onmousemove="showTooltip(this)" onmouseleave="hideTooltip(event)"><i class="fa-solid fa-folder"></i></button>
          <p class="soundTitle">Create Tab</p>
          <label class="toggle-box">
            <input class="checkbox" type="checkbox" data-variable="createTabSound" onchange="toggleSlider(this, soundChangeHandler)"
              checked>
            <div class="slider"></div>
          </label>
        </div>
        <div class="sound">
          <button class="openManagerBtn" onclick="setupFileManager(event)" data-type="soundsRepository" data-variable="closeTabSelectedSound" data-key="soundselect" onmousemove="showTooltip(this)" onmouseleave="hideTooltip(event)"><i class="fa-solid fa-folder"></i></button>
          <p class="soundTitle">Close Tab</p>
          <label class="toggle-box">
            <input class="checkbox" type="checkbox" data-variable="closeTabSound" onchange="toggleSlider(this, soundChangeHandler)"
              checked>
            <div class="slider"></div>
          </label>
        </div>
        <div class="sound">
          <button class="openManagerBtn" onclick="setupFileManager(event)" data-type="soundsRepository" data-variable="dragTabSelectedSound" data-key="soundselect" onmousemove="showTooltip(this)" onmouseleave="hideTooltip(event)"><i class="fa-solid fa-folder"></i></button>
          <p class="soundTitle">Drag Tab</p>
          <label class="toggle-box">
            <input class="checkbox" onclick="setupFileManager(event)" type="checkbox" data-variable="dragTabSound" onchange="toggleSlider(this, soundChangeHandler)"
              checked>
            <div class="slider"></div>
          </label>
        </div>
        <div class="sound">
          <button class="openManagerBtn" onclick="setupFileManager(event)" data-type="soundsRepository"  data-variable="dropTabSelectedSound" data-key="soundselect" onmousemove="showTooltip(this)" onmouseleave="hideTooltip(event)"><i class="fa-solid fa-folder"></i></button>
          <p class="soundTitle">Drop Tab</p>
          <label class="toggle-box">
            <input class="checkbox" type="checkbox" data-variable="dropTabSound" onchange="toggleSlider(this, soundChangeHandler)"
              checked>
            <div class="slider"></div>
          </label>
        </div>
        <div class="sound">
          <button class="openManagerBtn" onclick="setupFileManager(event)" data-type="soundsRepository"  data-variable="sendMessageSelectedSound" data-key="soundselect" onmousemove="showTooltip(this)" onmouseleave="hideTooltip(event)"><i class="fa-solid fa-folder"></i></button>
          <p class="soundTitle">Send Message</p>
          <label class="toggle-box">
            <input class="checkbox" type="checkbox" data-variable="sendMessageSound" onchange="toggleSlider(this, soundChangeHandler)"
              checked>
            <div class="slider"></div>
          </label>
        </div>
      </div>
    </div>`;


loadCSS('../views/modals/configuration/config.css')
loadScript('../views/modals/configuration/configScript.js')
PushModal.innerHTML += configTemplate
