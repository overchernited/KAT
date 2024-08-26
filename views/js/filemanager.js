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

function setFileManager(target, folder, ext, func) {
  let fileVariable = target.dataset.variable;
  let managerType = target.dataset.key;
  

    window.electron.loadFiles(folder, ext);
    window.electron.onFilesLoaded((FileArray) => {
      files.innerHTML = "";
      FileArray.forEach((file) => {
        selectedClass = (selectedFiles[fileVariable] === file.file) ? 'check' : 'file'
        const fileTemplate = `
        <div class="file">
          <div class="filebox blue ${selectedClass}" onclick="${func}(event, '${fileVariable}', '${file.file}', '${file.path}')">
            <i class="fa-solid fa-${selectedClass}"></i>
          </div>
          <p>${file.file}</p>
        </div>`;

        files.innerHTML += fileTemplate;
      });
    });
}

function SelectFile(event, filevariable, file, path) {
  selectedFiles[filevariable] = file;
  localStorage.setItem(filevariable, JSON.stringify(file));

  thisbox = event.currentTarget;
  document.querySelectorAll(".check").forEach((filebox) => {
    if (filebox.classList.contains("check")) {
      filebox.classList.remove("check");
      filebox.innerHTML = `<i class="fa-solid fa-file"></i>`;
    }
  });
  thisbox.classList.add("check");
  thisbox.innerHTML = '<i class="fa-solid fa-check"></i>';
}

function setupFileManager(event) {
  let target = event.target.closest(".openManagerBtn");
  let dataType = target.dataset.type;
  console.log(dataType)

  const [f, e, fu] = dataType.split('/');

  let folder = f;
  let ext = e;
  let func = fu;

  currentFolder = target.querySelector(".fa-solid");
  currentFolder.className = "fa-solid fa-folder-open";
  console.log(event);
  event.stopPropagation();
  soundRep("Sound5.mp3");
  setFileManager(target, folder, ext, func);
  openFileManager(event);
}

document.addEventListener("mousedown", (event) => {
  var clickOnDiv = filemanagerdiv.contains(event.target);
  if (currentFolder) {
    currentFolder.className = "fa-solid fa-folder";
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
