const filemanagerdiv = document.getElementById("filemanager");
const filemanagerbuttons = document.querySelectorAll(".openManagerBtn");
const files = document.getElementById("mngrFiles");
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
  
  // console.log(managerType);
  
  // let groupRepository = managerFiles[0][managerType + "Group"];
  
  // for (const groupName in groupRepository) {
    //   const groupDetails = groupRepository[groupName];
    //   const groupCategory = groupDetails.category;
    
    //   const groupTemplate = `     
    //   <div onclick="goToCategory('${groupCategory}')" class="group ${groupCategory}">
    //   <p>${groupName}</p>
    //   <i class="fa-solid fa-circle"></i>
    //   </div>`;
    
    //   groups.innerHTML += groupTemplate;
    // }
  files.innerHTML = "";
  let fileVariable = target.dataset.variable;
  let managerType = target.dataset.type;
  let repository = managerFiles[0][managerType];
  
  for (const fileName in repository) {
    const fileDetails = repository[fileName];
    const filePath = fileDetails.path;
    const fileCategory = fileDetails.category;
    
    let isSelected = selectedFiles[fileVariable] === filePath;
    let selectedClass = isSelected ? 'check' : "";
    defaultfile = filePath.endsWith(".mp3") ? "sound" : "theme"
    icon = isSelected ? 'check' : filePath.endsWith(".mp3") ? "music" : "brush"
    
    console.log(`Seleccionado ${isSelected} ${selectedFiles[fileVariable]} ${fileVariable}`)

    title.innerHTML = filePath.endsWith(".mp3")
      ? "Select a sound"
      : "Select a theme";


    const fileTemplate = `
      <div class="file">
        <div class="filebox ${fileCategory} ${selectedClass}" data-variable="${defaultfile}" onclick="SelectFile(event, '${fileVariable}', '${fileName}.mp3')">
          <i class="fa-solid fa-${icon}"></i>
        </div>
        <p>${fileName}</p>
      </div>`;

    files.innerHTML += fileTemplate;
    console.log("Nombre:", fileName);
    console.log("Ruta:", filePath);
    console.log("Categoría:", fileCategory);
    console.log("----------------------");
  }
}


function SelectFile(event, filevariable, file) {
    event.stopPropagation()
    selectedFiles[filevariable] = file
    localStorage.setItem(filevariable, JSON.stringify(file))


    thisbox = event.currentTarget
    document.querySelectorAll(".check").forEach((filebox)=>{
      if (filebox.classList.contains('check')){
        filebox.classList.remove('check')
        oldicon = filebox.dataset.variable == 'sound' ? 'music' :'brush'
        filebox.innerHTML = `<i class="fa-solid fa-${oldicon}"></i>`
      }
    })
    thisbox.classList.add('check')
    thisbox.innerHTML = '<i class="fa-solid fa-check"></i>'
}

function goToCategory(category){
    const toCategoryScroll = files.querySelector(`.${category}`)
    if (toCategoryScroll){
        toCategoryScroll.scrollIntoView({ behavior: 'smooth' });
    }
}

function setupFileManager(event){
    let target = event.target.closest(".openManagerBtn");
    currentFolder = target.querySelector(".fa-solid")
    currentFolder.className = 'fa-solid fa-folder-open'
    console.log(event);
    event.stopPropagation();
    soundRep('Sound5.mp3')
    setFileManager(target);
    openFileManager(event)
}


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

// configModal.addEventListener("wheel", (event) => {
//   if (filemanageropened) {
//     closeFileManager();
//   }
// });
