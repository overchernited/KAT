

const PushModal = document.getElementById('modalcontent')

const modulesTemplate = ` 
<div class="modules_tab" id="modules_tab">

</div>
`;


loadCSS('../views/modals/modules/modules.css', document.head)
loadScript('text/javascript', '../views/modals/modules/modulesscript.js', document.head)

PushModal.innerHTML = modulesTemplate
