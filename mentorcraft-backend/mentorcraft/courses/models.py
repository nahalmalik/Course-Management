from django.db import models

def course_image_upload_path(instance, filename):
    return f"course_images/{instance.title}_{filename}"

class Course(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    category = models.CharField(max_length=100)
    level = models.CharField(max_length=50)
    language = models.CharField(max_length=50)
    price = models.CharField(max_length=20)
    discount_price = models.CharField(max_length=20, blank=True)
    duration = models.CharField(max_length=50)
    lessons = models.PositiveIntegerField()
    image = models.ImageField(upload_to=course_image_upload_path, blank=True, null=True)

    instructor = models.CharField(max_length=100)
    instructor_email = models.EmailField()
    rating = models.FloatField(default=4.8)
    students = models.PositiveIntegerField(default=0)

    # ✅ Extended fields
    curriculum_intro = models.TextField(blank=True)
    overview = models.TextField(blank=True)
    faqs = models.JSONField(blank=True, null=True)
    curriculum = models.JSONField(blank=True, null=True)
    videos = models.JSONField(blank=True, null=True)

    # Optional fields
    seo_title = models.CharField(max_length=255, blank=True)
    seo_keywords = models.TextField(blank=True)
    seo_description = models.TextField(blank=True)
    has_expiration = models.BooleanField(default=False)
    tags = models.JSONField(blank=True, null=True)

    def __str__(self):
        return self.title
