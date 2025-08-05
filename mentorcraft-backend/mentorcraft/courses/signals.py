# courses/signals.py

from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Course
from firebase_sync.sync_courses_to_firebase import sync_single_course

@receiver(post_save, sender=Course)
def auto_sync_course_to_firebase(sender, instance, created, **kwargs):
    if created:
        sync_single_course(instance)
