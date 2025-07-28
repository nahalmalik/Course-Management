from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class InstructorProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='instructor_profile')
    phone = models.CharField(max_length=20, blank=True)
    website = models.URLField(blank=True)
    bio = models.TextField(blank=True)
    image = models.ImageField(upload_to='instructors/', blank=True, null=True)

    def __str__(self):
        return self.user.get_full_name() or self.user.email
