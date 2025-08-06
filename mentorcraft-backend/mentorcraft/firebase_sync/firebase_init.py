import firebase_admin
from firebase_admin import credentials
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
cred_path = os.path.join(BASE_DIR, 'firebase_config.json')

# ✅ Always get or initialize the app
if not firebase_admin._apps:
    cred = credentials.Certificate(cred_path)
    firebase_app = firebase_admin.initialize_app(cred)
else:
    firebase_app = firebase_admin.get_app()

# ✅ Now firebase_app is available for import
