# student/signals.py

from django.db.models.signals import post_save
from django.db.models import Q
from django.dispatch import receiver
from django.contrib.auth import get_user_model
from .models import AssignmentSubmission, QuizAttempt, InstructorNotification, StudentNotification

User = get_user_model()

# Notify instructor when a student submits an assignment
@receiver(post_save, sender=AssignmentSubmission)
def notify_instructor_on_assignment_submission(sender, instance, created, **kwargs):
    if created:
        try:
            # Get instructor from string (Course.instructor = username)
            instructor_user = User.objects.get(username=instance.assignment.course.instructor)
            InstructorNotification.objects.create(
                instructor=instructor_user,
                message=f"{instance.student.username} submitted assignment: {instance.assignment.title}"
            )
        except User.DoesNotExist:
            # Instructor username in course doesn't match any User
            pass

# Notify instructor when a student submits a quiz
@receiver(post_save, sender=QuizAttempt)
def notify_instructor_on_quiz_submission(sender, instance, created, **kwargs):
    if created:
        try:
            instructor_user = User.objects.get(username=instance.quiz.course.instructor)
            InstructorNotification.objects.create(
                instructor=instructor_user,
                message=f"{instance.student.username} attempted quiz: {instance.quiz.title}"
            )
        except User.DoesNotExist:
            pass

# Notify student when instructor grades an assignment
@receiver(post_save, sender=AssignmentSubmission)
def notify_student_on_assignment_graded(sender, instance, **kwargs):
    if instance.graded and not StudentNotification.objects.filter(
        Q(student=instance.student) &
        Q(message__icontains=instance.assignment.title) &
        Q(message__icontains='graded')
    ).exists():
        StudentNotification.objects.create(
            student=instance.student,
            message=f"Your assignment '{instance.assignment.title}' has been graded."
        )