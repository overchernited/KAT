from flask import Flask, request, jsonify
import time
import subprocess

app = Flask(__name__)

# Variable global para almacenar datos
stored_data = {}
clients_id = 0


subprocess.Popen(
    'ngrok http --domain=flexible-elk-monthly.ngrok-free.app 5000',
    shell=True,
    creationflags=subprocess.CREATE_NEW_CONSOLE,
)

@app.route('/')
def home():
    return "Servidor listo para recibir datos"

@app.route('/submit', methods=['POST'])
def submit():
    global stored_data
    data = request.get_json()
    command = data.get('command')
    client = data.get('client')
    
    print(f'Command: {command}, Client: {client}')
    
    # Almacenar datos para que puedan ser consultados más tarde
    stored_data = {
        'command': command,
        'client': client
    }
    
    return jsonify({
        'message': f'Datos recibidos correctamente: Command: {command}, Client: {client}'
    })

@app.route('/fetch_data', methods=['GET'])
def fetch_data():
    global stored_data
    # Si no hay datos almacenados, mantenemos la conexión abierta
    while not stored_data:
        time.sleep(1)  # Esperar 1 segundo antes de verificar nuevamente
    
    # Respondemos con los datos almacenados
    data = stored_data
    stored_data = {}  # Limpiar los datos después de enviarlos
    return jsonify(data)

@app.route('/get_client_id', methods=['GET'])
def get_client_id():
    global clients_id  # Indicar que se está utilizando la variable global
    clients_id += 1  # Incrementar el valor de la variable global
    data = {
        'clients_id': clients_id,
    }
    return jsonify(data)

if __name__ == '__main__':
    app.run(port=5000)