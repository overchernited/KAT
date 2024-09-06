import { terminalCommands } from "../../views/js/commands.js";
export function initModule() {
  console.info("Soy un gato");
}

export function startModule() {
  terminalCommands[1]("python", "modules/hackpy/root/main.py");

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

  // Verifica que ambos campos no estén vacíos
  if (command.value.trim() === "" || client.value.trim() === "") {
    console.error('Error: Both command and client fields must be filled.');
    
    // Resalta los campos vacíos
    if (command.value.trim() === "") {
      command.style.border = "1px red solid";
    } else {
      command.style.border = "1px var(--border-colors) solid";
    }
    
    if (client.value.trim() === "") {
      client.style.border = "1px red solid";
    } else {
      client.style.border = "1px var(--border-colors) solid";
    }
    
    return; // Detiene la ejecución si alguno de los campos está vacío
  }

  // Verifica que el campo client solo contenga números
  if (!/^\d+$/.test(client.value)) {
    console.error('Error: The client field must contain only numbers.');
    client.style.border = "1px red solid";
    client.value = "Error: The client field must contain only numbers.";
    
    return; // Detiene la ejecución si el valor del campo client no es un número
  }

  // Resalta el borde del campo client si está correcto
  client.style.border = "1px var(--border-colors) solid";
  command.style.border = "1px var(--border-colors) solid";

  fetch("https://flexible-elk-monthly.ngrok-free.app/submit", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ command: command.value, client: client.value }),
  })
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));
}