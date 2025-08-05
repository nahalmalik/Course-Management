from django.contrib.auth import get_user_model
from firebase_admin import auth
from firebase_sync.firebase_init import firebase_admin  # your current init logic auto-runs
User = get_user_model()

def sync_users_to_firebase():
    users = User.objects.all()
    for user in users:
        try:
            if not user.email:
                continue

            uid = str(user.id)
            display_name = f"{user.first_name} {user.last_name}".strip() or user.email

            try:
                auth.get_user(uid)
                auth.update_user(
                    uid,
                    email=user.email,
                    display_name=display_name,
                )
                print(f"[UPDATED] Firebase user: {user.email}")
            except auth.UserNotFoundError:
                try:
                    auth.create_user(
                        uid=uid,
                        email=user.email,
                        display_name=display_name,
                        password="Temporary@123"
                    )
                    print(f"[CREATED] Firebase user: {user.email}")
                except auth.EmailAlreadyExistsError:
                    existing = auth.get_user_by_email(user.email)
                    auth.update_user(
                        existing.uid,
                        display_name=display_name
                    )
                    print(f"[FIXED] Email already existed, updated user {user.email}")

        except Exception as e:
            print(f"[ERROR] Skipping {user.email} → {e}")
