import uuid
from django.db import models

def course_image_upload_path(instance, filename):
    return f"course_images/{instance.title}_{filename}"

def course_video_upload_path(instance, filename):
    return f"course_videos/{instance.title}_{filename}"

class Course(models.Model):
    # ✅ Unique Course ID
    course_id = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)

    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    category = models.CharField(max_length=100)
    level = models.CharField(max_length=50)
    language = models.CharField(max_length=50)
    price = models.DecimalField(max_digits=8, decimal_places=2)
    discount_price = models.DecimalField(max_digits=8, decimal_places=2, blank=True, null=True)
    duration = models.CharField(max_length=50)
    lessons = models.PositiveIntegerField()
    image = models.ImageField(upload_to=course_image_upload_path, blank=True, null=True)

    video_file = models.FileField(upload_to=course_video_upload_path, blank=True, null=True)

    instructor = models.CharField(max_length=100)
    instructor_email = models.EmailField()
    rating = models.FloatField(default=4.8)
    students = models.PositiveIntegerField(default=0)

    curriculum_intro = models.TextField(blank=True)
    overview = models.TextField(blank=True)
    faqs = models.JSONField(blank=True, null=True)
    curriculum = models.JSONField(blank=True, null=True)

    videos = models.JSONField(blank=True, null=True)

    seo_title = models.CharField(max_length=255, blank=True)
    seo_keywords = models.TextField(blank=True)
    seo_description = models.TextField(blank=True)
    has_expiration = models.BooleanField(default=False)
    tags = models.JSONField(blank=True, null=True)

    def __str__(self):
        return self.title
