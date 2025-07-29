import uuid
from django.db import models
from django.conf import settings

def course_image_upload_path(instance, filename):
    return f"course_images/{instance.title}_{filename}"

def course_video_upload_path(instance, filename):
    return f"course_videos/{instance.title}_{filename}"

class Course(models.Model):
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
    has_expiration = models.BooleanField(default=False)
    tags = models.JSONField(blank=True, null=True)

    def __str__(self):
        return self.title


User = settings.AUTH_USER_MODEL

class Note(models.Model):
    course = models.ForeignKey('courses.Course', on_delete=models.CASCADE, related_name='notes')
    title = models.CharField(max_length=255)
    description = models.TextField()
    file = models.FileField(upload_to='notes/')
    uploaded_at = models.DateTimeField(auto_now_add=True)


class Assignment(models.Model):
    course = models.ForeignKey('courses.Course', on_delete=models.CASCADE, related_name='assignments')
    title = models.CharField(max_length=255)
    description = models.TextField()
    due_date = models.DateField()
    file = models.FileField(upload_to='assignments/')
    uploaded_at = models.DateTimeField(auto_now_add=True)

class Lecture(models.Model):
    course = models.ForeignKey('courses.Course', on_delete=models.CASCADE, related_name='lectures')
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    duration = models.CharField(max_length=50, help_text="e.g., 10 min")
    icon = models.CharField(max_length=100, blank=True)
    video = models.URLField(blank=True, help_text="YouTube embed link")

class Quiz(models.Model):
    course = models.ForeignKey('courses.Course', on_delete=models.CASCADE, related_name='quizzes')
    title = models.CharField(max_length=255)
    description = models.TextField()
    time_limit = models.PositiveIntegerField(help_text="Time limit in minutes")
    attempts_allowed = models.PositiveIntegerField(default=1)
    passing_percentage = models.DecimalField(max_digits=5, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
    is_draft = models.BooleanField(default=True)

class QuizQuestion(models.Model):
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE, related_name='questions')
    question_text = models.TextField()
    explanation = models.TextField(blank=True)
    question_type = models.CharField(max_length=50, choices=[('mcq', 'Multiple Choice')], default='mcq')
    points = models.PositiveIntegerField(default=1)

class QuizOption(models.Model):
    question = models.ForeignKey(QuizQuestion, on_delete=models.CASCADE, related_name='options')
    text = models.CharField(max_length=255)
    is_correct = models.BooleanField(default=False)
