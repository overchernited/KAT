const PushModal = document.getElementById("modalcontent");

const configTemplate = `
<div class="serverConfiguration">
    <div class="box">
    
      <p class="boxtitle">Reload</p>
      <button id="resetAllClients" class="hackpybutton reload"><i class="fa-solid fa-rotate-right"></i></div></button>
    </div>
</div>
`;

PushModal.innerHTML = configTemplate;
loadCSS("../modules/hackpy/main.css", PushModal);
loadScript("module", "../modules/hackpy/views/server/script.js", document.head).then(() =>{
  document.getElementById("resetAllClients").onclick = () => {
    console.log("submitCommand button clicked.");

    window.hackfuncs.sendGlobalCommand("reset");
  };

})