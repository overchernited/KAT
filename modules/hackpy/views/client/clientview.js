const PushModal = document.getElementById("modalcontent");
const configTemplate = `
<p id="title">HACK PY</p>
<form id="hackpy">
  <button
    class="hackpybutton reload"
    style="height: 5%; width: 5%"
    id="reloadBtn"
    type="button"
  >
    <i class="fa-solid fa-rotate-right"></i>
  </button>
  <div id="clientsContainer"></div>
  <div id="controls">
    <input type="text" id="command" name="command" placeholder=">:" />
    <button
      class="hackpybutton"
      style="height: 100%; width: 10%"
      id="submitCommand"
      type="button"
    >
      <i class="fa-solid fa-play"></i>
    </button>
  </div>
</form>
`;

PushModal.innerHTML = configTemplate;
loadCSS("../modules/hackpy/main.css", PushModal);

// Espera un poco antes de cargar los scripts y el CSS

// Cargar el script y añadir los event listeners usando .then
loadScript("module", "../modules/hackpy/views/client/script.js", document.head)
  .then(() => {
    document.getElementById("submitCommand").onclick = () => {
      console.log("submitCommand button clicked.");

      window.hackfuncs.submitSelectedCommands();
    };

    // Añadir event listener para el botón 'reloadBtn'
    document.getElementById("reloadBtn").onclick = () => {
      window.hackfuncs.reloadClients();
    };

    window.hackfuncs.reloadClients()
  })
  .catch((error) => {
    console.error("Error loading script:", error);
  });

loadScript(
  "module",
  "https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js",
  document.head
);
