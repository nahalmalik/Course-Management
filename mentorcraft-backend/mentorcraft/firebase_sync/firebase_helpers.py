# firebase_sync/firebase_helpers.py

from firebase_admin import auth

def is_user_synced_to_firebase(user):
    try:
        auth.get_user(str(user.id))
        return True
    except auth.UserNotFoundError:
        return False
    except Exception:
        return False  # Catch any other unexpected errors
