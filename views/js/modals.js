const modalCloseButton = document.getElementById("closeModal");
const modalBack = document.getElementById("modalBack");
const modal = document.getElementById("modalFore");

let modalOpen = false;

function closeModal() {
  modalOpen = false;
  modalBack.style.opacity = "0";
  modal.style.height = "50";
  modal.style.width = "50";
  setTimeout(() => {
    modalBack.style.display = "none";
  }, 200);
}

function openModal(tabs) {
  const tabsContainer = document.getElementById("tabsContainer");
  tabsContainer.innerHTML = "";
  return new Promise((resolve, reject) => {
    if (!modalOpen) {
      modalOpen = true;
      modalBack.style.display = "flex";
      modal.style.height = "50%";
      modal.style.width = "50%";
      setTimeout(() => {
        modalBack.style.opacity = "1";
        modal.style.height = "60%";
        modal.style.width = "50%";

        addTab(tabs);

        // Obtener el path basado en el nombre de la pestaña o cargar la primera pestaña si `view` no está definido
        const path = Object.values(tabs[0])[0];

        if (path) {
          loadView(path).then(resolve).catch(reject);
        } else {
          reject(new Error(`Path not found for view: ${view}`));
        }
      }, 10);
    } else {
      closeModal();
      setTimeout(() => {
        openModal(tabs).then(resolve).catch(reject);
      }, 200);
    }
  });
}

function addTab(tabs) {

  // Mapear los nombres de pestañas a sus paths
  tabPaths = {}; // Reiniciar el mapeo
  tabs.forEach((tab, index) => {
    const [name, path] = Object.entries(tab)[0];
    tabPaths[name] = path; // Guardar el path asociado al nombre de la pestaña

    // Añadir la clase 'actived' solo a la primera pestaña
    let activeClass = index === 0 ? 'actived' : '';
    
    let tabTemplate = `
      <div class="modalTab ${activeClass}" onclick="handleTabClick(this, '${path}')">
        <p>${name}</p>
      </div>
    `;
    
    tabsContainer.innerHTML += tabTemplate;
  });
}

function handleTabClick(tabElement, path) {
  // Obtener el contenedor de pestañas
  const tabsContainer = document.getElementById("tabsContainer");

  // Eliminar la clase 'actived' de todas las pestañas
  const tabs = tabsContainer.getElementsByClassName("modalTab");
  for (let i = 0; i < tabs.length; i++) {
    tabs[i].classList.remove("actived");
  }

  // Añadir la clase 'actived' a la pestaña clickeada
  tabElement.classList.add("actived");
  loadView(path);
}
