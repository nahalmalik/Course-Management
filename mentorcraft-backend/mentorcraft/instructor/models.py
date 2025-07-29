from django.db import models
from django.contrib.auth import get_user_model
from courses.models import Course

User = get_user_model()

class InstructorProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='instructor_profile')
    phone = models.CharField(max_length=20, blank=True)
    website = models.URLField(blank=True)
    bio = models.TextField(blank=True)
    image = models.ImageField(upload_to='instructors/', blank=True, null=True)

    def __str__(self):
        return self.user.get_full_name() or self.user.email


class Announcement(models.Model):
    ANNOUNCEMENT_TYPES = [
        ('GENERAL', 'General'),
        ('ASSIGNMENT', 'Assignment'),
        ('QUIZ', 'Quiz'),
    ]

    instructor = models.ForeignKey(User, on_delete=models.CASCADE)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    content = models.TextField()
    type = models.CharField(max_length=20, choices=ANNOUNCEMENT_TYPES, default='GENERAL')
    is_urgent = models.BooleanField(default=False)
    publish_immediately = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} ({self.course.title})"


class InstructorCourseAnalytics(models.Model):
    instructor = models.ForeignKey(User, on_delete=models.CASCADE)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)

    total_earnings = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    enrollments = models.PositiveIntegerField(default=0)
    average_quiz_score = models.FloatField(default=0.0)

    rating = models.FloatField(default=0.0)
    completion_rate = models.FloatField(default=0.0)

    last_synced = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.instructor.email} - {self.course.title}"


class MonthlyAnalytics(models.Model):
    analytics = models.ForeignKey(InstructorCourseAnalytics, on_delete=models.CASCADE, related_name='monthly_data')
    month = models.CharField(max_length=20)  # e.g., "July"
    year = models.CharField(max_length=4)

    earnings = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    enrollments = models.PositiveIntegerField(default=0)
    quiz_scores = models.JSONField(default=list)  # list of quiz scores

    class Meta:
        unique_together = ('analytics', 'month', 'year')

    def average_quiz_score(self):
        scores = self.quiz_scores
        if scores:
            return sum(scores) / len(scores)
        return 0.0

    def __str__(self):
        return f"{self.analytics.course.title} ({self.month} {self.year})"
