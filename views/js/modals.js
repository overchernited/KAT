const modalCloseButton = document.getElementById('closeModal')
const modalBack =  document.getElementById('modalview')
const modal = document.getElementById('modalcontent')

modalTemplate = `
<div class="modalControls">
    <button class="control-button close-button configclse" onclick="closeModal()"" id="closeModal"><i class="fa-solid fa-xmark"></i></button>
</div>`

let modalOpen = false

function closeModal(){
    modalOpen = false
    modalBack.style.opacity = '0'
    modal.style.height = '50'
    modal.style.width = '50'
    setTimeout(() => {
        modalBack.style.display = 'none'
    }, 200);
}

function openModal(view) {
    return new Promise((resolve, reject) => {
      if (!modalOpen) {
        modalOpen = true;
        modalBack.style.display = 'flex';
        modal.style.height = '50%';
        modal.style.width = '50%';
        setTimeout(() => {
          modalBack.style.opacity = '1';
          modal.style.height = '60%';
          modal.style.width = '50%';
          modal.innerHTML = modalTemplate;
  
          // Asegurarse de que `loadView` se complete antes de resolver la promesa
          loadView(view).then(resolve).catch(reject);
        }, 10);
      } else {
        closeModal();
        setTimeout(() => {
          openModal(view).then(resolve).catch(reject);
        }, 200);
      }
    });
  }
