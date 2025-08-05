from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import CustomUser
from instructor.models import InstructorProfile

@receiver(post_save, sender=CustomUser)
def create_instructor_profile(sender, instance, created, **kwargs):
    if created and instance.role == "instructor":
        InstructorProfile.objects.get_or_create(user=instance)

# users/signals.py

from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth.models import User
from firebase_admin import auth
from firebase_sync import firebase_init  # this auto-inits Firebase

@receiver(post_save, sender=User)
def sync_user_to_firebase(sender, instance, **kwargs):
    if not instance.email:
        return

    uid = str(instance.id)
    display_name = f"{instance.first_name} {instance.last_name}".strip()

    try:
        auth.get_user(uid)
        auth.update_user(
            uid,
            email=instance.email,
            display_name=display_name,
        )
    except auth.UserNotFoundError:
        auth.create_user(
            uid=uid,
            email=instance.email,
            display_name=display_name,
            password="Temporary@123"
        )
