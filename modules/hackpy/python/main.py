import os
import firebase_admin
from firebase_admin import credentials, firestore
from flask import Flask, request, jsonify

# Configura Firebase
base_dir = os.path.dirname(os.path.abspath(__file__))
cred_path = os.path.join(base_dir, 'hackat-b31c7-firebase-adminsdk-qh08t-aa1740898a.json')
cred = credentials.Certificate(cred_path)
firebase_admin.initialize_app(cred)
db = firestore.client()

app = Flask(__name__)
os.environ['FLASK_ENV'] = 'production'

def set_client_count_to_zero():
    try:
        global_ids_ref = db.collection('global_ids').document('client')
        # Actualiza el campo 'count' a 0, sin importar si el documento ya existe
        global_ids_ref.set({'count': 0}, merge=True)
        print("Set 'count' to 0 in 'client' document.")
    except Exception as e:
        print(f"Error setting client count to 0: {e}")

def cleanup_users():
    try:
        users_ref = db.collection('users')
        docs = users_ref.stream()
        for doc in docs:
            doc.reference.delete()
        print("Collection 'users' cleaned up.")
    except Exception as e:
        print(f"Error during cleanup: {e}")

# Establecer count a 0 y limpiar la colección al inicio
set_client_count_to_zero()
cleanup_users()

@app.route('/submit', methods=['POST'])
def submit():
    data = request.json
    command = data.get('command')
    client = data.get('client')

    # Enviar datos a Firebase
    user_ref = db.collection('users').document(client)
    user_ref.set({
        'command': command
    }, merge=True)

    print(f'Sent to Firebase: {data}')  # Para depuración
    return jsonify({"status": "success"})

if __name__ == '__main__':
    app.run(debug=False)