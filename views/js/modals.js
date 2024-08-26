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

function openModal(view){
    if (modalOpen == false){
        modalOpen = true
        modalBack.style.display = 'flex'
        modal.style.height = '50'
        modal.style.width = '50'
        setTimeout(() => {
            modalBack.style.opacity = '1'
            modal.style.height = '60%'
            modal.style.width = '50%'
        }, 10);
    
    
        modal.innerHTML = modalTemplate
        loadView(view)
    } else{
        closeModal()
        setTimeout(() => {
            openModal(view)
            
        }, 200);
    }


}

async function loadView(view) {
    const response = await fetch(view);
    const viewScript = await response.text();
    eval(viewScript);
}

function loadCSS(url) {
    // Crea un nuevo elemento <link>
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = url;

    // Añade el elemento <link> al <head> del documento
    document.head.appendChild(link);
}

function loadScript(src) {
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => console.log(`${src} loaded successfully`);
    script.onerror = () => console.error(`Failed to load ${src}`);
    document.body.appendChild(script);
}
