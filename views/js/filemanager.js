const filemanagerdiv = document.getElementById("filemanager");
const filemanagerbuttons = document.querySelectorAll(".openManagerBtn");
const files = document.getElementById("mngrFiles");
const groups = document.getElementById("mngrGroups");
const title = document.getElementById("mngrTitle");


let currentFolder;

let filemanageropened = false;

function openFileManager(event) {
  filemanagerdiv.style.width = "0%";
  filemanagerdiv.style.height = "0%";
  filemanagerdiv.style.opacity = "0";

  filemanagerdiv.style.display = "flex";

  setTimeout(() => {
    filemanagerdiv.style.width = "15%";
    filemanagerdiv.style.height = "20%";
    filemanagerdiv.style.opacity = "1";

    const cursorX = event.clientX;
    const cursorY = event.clientY;

    filemanagerdiv.style.top = `${cursorY}px`;
    filemanagerdiv.style.left = `${cursorX - 125}px`;

    filemanageropened = true;
  }, 110);
}

function closeFileManager() {
  filemanagerdiv.style.width = "0%";
  filemanagerdiv.style.height = "0%";
  filemanagerdiv.style.opacity = "0";

  setTimeout(() => {
    filemanagerdiv.style.display = "none";
  }, 30);
  filemanageropened = false;
}

function setFileManager(target) {
  files.innerHTML = "";
  groups.innerHTML = "";
  let managerType = target.dataset.type;
  let SoundVariable = target.dataset.variable;

  console.log(managerType);

  let repository = managerFiles[0][managerType];
  let groupRepository = managerFiles[0][managerType + "Group"];

  for (const groupName in groupRepository) {
    const groupDetails = groupRepository[groupName];
    const groupCategory = groupDetails.category;

    const groupTemplate = `     
      <div onclick="goToCategory('${groupCategory}')" class="group ${groupCategory}">
        <p>${groupName}</p>
        <i class="fa-solid fa-circle"></i>
      </div>`;

    groups.innerHTML += groupTemplate;
  }

  for (const fileName in repository) {
    const fileDetails = repository[fileName];
    const filePath = fileDetails.path;
    const fileCategory = fileDetails.category;

    let icon = filePath.endsWith(".mp3") ? "fa-music" : "fa-brush";

    let isSelected = selectedSounds[SoundVariable] === filePath;
    let selectedClass = isSelected ? "selected" : "";
    console.log(`Seleccionado ${isSelected} ${selectedSounds[SoundVariable]} ${SoundVariable}`)

    title.innerHTML = filePath.endsWith(".mp3")
      ? "Select a sound"
      : "Select a theme";


    const fileTemplate = `
      <div class="file">
        <div class="filebox ${fileCategory}">
          <i class="fa-solid ${icon}"></i>
        </div>
        <p>${fileName} ${selectedClass}</p>
      </div>`;

    files.innerHTML += fileTemplate;
    console.log("Nombre:", fileName);
    console.log("Ruta:", filePath);
    console.log("Categoría:", fileCategory);
    console.log("----------------------");
  }
}

function goToCategory(category){
    const toCategoryScroll = files.querySelector(`.${category}`)
    if (toCategoryScroll){
        toCategoryScroll.scrollIntoView({ behavior: 'smooth' });
    }
}

filemanagerbuttons.forEach((button) => {
  button.addEventListener("click", (event) => {
    let target = event.target.closest(".openManagerBtn");
    currentFolder = target.querySelector(".fa-solid")
    currentFolder.className = 'fa-solid fa-folder-open'
    console.log(event);
    event.stopPropagation();
    soundRep('Sound5.mp3')
    setFileManager(target);
    openFileManager(event)
  });

  // button.addEventListener('onmouseleave', (event) =>{
  //     openFileManager()
  // })
});

document.addEventListener("mousedown", (event) => {
  var clickOnDiv = filemanagerdiv.contains(event.target);
  if (currentFolder){
    currentFolder.className = 'fa-solid fa-folder'
  }
  var hasOpenManagerBtnClass =
    event.target.classList.contains("openManagerBtn");

  if (!clickOnDiv && !hasOpenManagerBtnClass && filemanageropened) {
    closeFileManager();
  }
});

configModal.addEventListener("wheel", (event) => {
  if (filemanageropened) {
    closeFileManager();
  }
});
