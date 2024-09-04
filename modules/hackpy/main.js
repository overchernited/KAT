import { terminalCommands } from "../../views/js/commands.js";
export function initModule() {
  console.info("Soy un gato");
}

export function startModule() {
  terminalCommands[1]("python", "modules/hackpy/python/main.py");

  // Abre el modal y luego configura el eventListener
  openModal("../modules/hackpy/view.js")
    .then(() => {
      const submitBtn = document.getElementById("submitCommand");
      submitBtn.addEventListener("click", submitForm);
    })
    .catch((error) => {
      console.error("Error opening modal:", error);
    });
}

function submitForm() {
  const command = document.getElementById("command");
  const client = document.getElementById("client");

  // Verifica que client solo contenga números
  if (!/^\d+$/.test(client.value)) {
    console.error('Error: The client field must contain only numbers.');
    client.style.border = "1px red solid"
    client.value = "Error: The client field must contain only numbers."
    
    return; // Detiene la ejecución si el valor no es un número
  }

  fetch("http://localhost:5000/submit", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ command: command.value, client: client.value }),
  })
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));
  client.style.border = "1px var(--border-colors) solid"
}