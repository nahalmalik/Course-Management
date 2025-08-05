from firebase_admin import auth
from users.models import CustomUser

def sync_firebase_users_to_django():
    print("🔁 Syncing users from Firebase to Django...")
    all_users = auth.list_users().iterate_all()

    for fb_user in all_users:
        try:
            if not fb_user.email:
                continue  # Skip anonymous or invalid users

            # Check if the user already exists in Django
            user_exists = CustomUser.objects.filter(email=fb_user.email).exists()

            if user_exists:
                print(f"[SKIP] {fb_user.email} already in Django")
                continue

            # Split display name into first & last (optional)
            if fb_user.display_name:
                name_parts = fb_user.display_name.split()
                first_name = name_parts[0]
                last_name = " ".join(name_parts[1:]) if len(name_parts) > 1 else ""
            else:
                first_name = ""
                last_name = ""

            # Create user in Django (set unusable password)
            CustomUser.objects.create_user(
                email=fb_user.email,
                first_name=first_name,
                last_name=last_name,
                password=None,
                role='student'  # or 'instructor', or infer based on your logic
            )

            print(f"[CREATED] {fb_user.email} synced to Django")

        except Exception as e:
            print(f"[ERROR] Skipping user {fb_user.email} → {e}")
