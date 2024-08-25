let isCollapsed = true;
let isAnimating = false;
const modulesTab = document.getElementById('modules_tab');
const collapseButton = document.getElementById('collapseModules');

function applyAnims() {
  const newTransform = isCollapsed ? 'translateY(-50%) rotate(0deg)' : 'translateY(-50%) rotate(180deg)';
  modulesTab.classList.toggle('tabcollapsed'); 

  collapseButton.style.transition = 'height .4s ease, left .4s ease, transform .4s ease';
  collapseButton.style.transform = newTransform;
  collapseButton.classList.toggle('collapsed');
}

function collapseModulesTab() {
  
  if (isAnimating) return;
  isAnimating = true;
  
  if (isCollapsed) {
    modulesTab.style.display = 'flex';

    setTimeout(() => {
      applyAnims();
      isCollapsed = !isCollapsed;
    }, 10);

    isAnimating = false;
  } else {
    applyAnims();
    setTimeout(() => {
      isCollapsed = !isCollapsed;
      isAnimating = false;
    }, 430);
  }

  setTimeout(() => {
    const currentTransition = collapseButton.style.transition;
    if (currentTransition) {
      const updatedTransition = currentTransition
      .replace('left', 'width')
      .replace('transform', 'height');
      collapseButton.style.transition = updatedTransition;
    }
  }, 430);
}

function loadModulesAtDOM(modulesarray){
  modulesarray.forEach(module => {
    const div = document.createElement('div');
    div.classList.add('module_template');
    div.innerHTML = `<p>${module}</p>`;
    modulesTab.appendChild(div);
  });
}


window.addEventListener('modulesLoaded', () => {
  loadModulesAtDOM(modules.katmodules.getModules())
});