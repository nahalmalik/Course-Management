from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import CustomUser
from instructor.models import InstructorProfile

@receiver(post_save, sender=CustomUser)
def create_instructor_profile(sender, instance, created, **kwargs):
    if created and instance.role == "instructor":
        InstructorProfile.objects.get_or_create(user=instance)
