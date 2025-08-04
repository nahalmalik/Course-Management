#student/views.py
from rest_framework import generics, permissions
from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import ListAPIView, ListCreateAPIView, CreateAPIView, RetrieveUpdateAPIView
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.utils import timezone
from rest_framework import status
from .models import (
    StudentProfile, Review, InstructorReply, Notification,
    AssignmentSubmission, QuizAttempt,StudentDiscussion,
    StudentNotification, InstructorNotification,Quiz,QuizAnswer
)
from .serializers import (
    StudentProfileSerializer,
    ReviewSerializer,
    InstructorReplySerializer,
    NotificationSerializer,
    AssignmentSubmissionSerializer,
    QuizAttemptSerializer,
    StudentNotificationSerializer,
    InstructorNotificationSerializer,
    AssignmentSerializer,
    StudentQuizListSerializer,
    SubmittedQuizAttemptSerializer,
    StudentDiscussionSerializer
)
from courses.models import Course, Quiz, Assignment
from users.models import Enrollment


# ──────── Profile ────────

class StudentProfileView(RetrieveUpdateAPIView):
    serializer_class = StudentProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        profile, _ = StudentProfile.objects.get_or_create(user=self.request.user)
        return profile


# ──────── Reviews & Replies ────────

class ReviewListCreateView(ListCreateAPIView):
    serializer_class = ReviewSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Review.objects.filter(student=self.request.user)

    def perform_create(self, serializer):
        review = serializer.save(student=self.request.user)
        Notification.objects.create(
            user=review.course.instructor,
            message=f"New review posted by {self.request.user.email} on {review.course.title}"
        )


class InstructorReplyView(CreateAPIView):
    serializer_class = InstructorReplySerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        reply = serializer.save(instructor=self.request.user)
        Notification.objects.create(
            user=reply.review.student,
            message=f"Reply from {self.request.user.email} on your review for {reply.review.course.title}"
        )


class InstructorReviewListView(ListAPIView):
    serializer_class = ReviewSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        course_ids = Course.objects.filter(
            instructor__iexact=user.get_full_name().strip()
        ).values_list('id', flat=True)
        return Review.objects.filter(course__id__in=course_ids).order_by('-created_at')


# ──────── Notifications ────────

class NotificationListView(ListAPIView):
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user).order_by('-created_at')


class StudentNotificationListView(ListAPIView):
    serializer_class = StudentNotificationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return StudentNotification.objects.filter(student=self.request.user)


class InstructorNotificationListView(ListAPIView):
    serializer_class = InstructorNotificationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return InstructorNotification.objects.filter(instructor=self.request.user)


# ──────── Assignments ────────

class StudentAssignmentListView(ListAPIView):
    serializer_class = AssignmentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        enrolled_courses = Enrollment.objects.filter(user=user).values_list('course_id', flat=True)
        return Assignment.objects.filter(course__id__in=enrolled_courses)


class AssignmentSubmissionCreateView(CreateAPIView):
    serializer_class = AssignmentSubmissionSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(student=self.request.user)


# ──────── Quizzes ────────

class AvailableQuizListView(ListAPIView):
    serializer_class = StudentQuizListSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        enrolled_courses = Enrollment.objects.filter(user=user).values_list('course_id', flat=True)
        return Quiz.objects.filter(course__id__in=enrolled_courses)

    # Pass request context to serializer (required for user-based fields)
    def get_serializer_context(self):
        return {'request': self.request}


class QuizAttemptListView(ListAPIView):
    serializer_class = QuizAttemptSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return QuizAttempt.objects.filter(student=self.request.user).order_by('-started_at')


class QuizAttemptCreateView(CreateAPIView):
    serializer_class = QuizAttemptSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(student=self.request.user)


class SubmittedQuizAttemptListView(ListAPIView):
    serializer_class = SubmittedQuizAttemptSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return QuizAttempt.objects.filter(
            student=self.request.user,
            completed_at__isnull=False  # ✅ Only submitted ones
        ).order_by('-completed_at')

from django.utils import timezone

class SubmitQuizAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        data = request.data
        quiz_id = data.get('quiz')
        answers = data.get('answers', [])

        quiz = Quiz.objects.get(id=quiz_id)
        attempt_number = QuizAttempt.objects.filter(student=request.user, quiz=quiz).count() + 1

        attempt = QuizAttempt.objects.create(
            student=request.user,
            quiz=quiz,
            attempt_number=attempt_number,
            started_at=timezone.now(),  # optional
            completed_at=timezone.now(),  # ✅ THIS IS IMPORTANT
        )

        for answer in answers:
            QuizAnswer.objects.create(
                attempt=attempt,
                question_id=answer['question'],
                selected_option_id=answer['selected_option'],
            )

        # Optional: calculate score and save
        score = attempt.calculate_score()  # assuming this method exists
        attempt.score = score
        attempt.save()

        return Response({"score": score}, status=201)
    
class StudentDiscussionListCreateView(generics.ListCreateAPIView):
    serializer_class = StudentDiscussionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return StudentDiscussion.objects.filter(student=self.request.user)

    def perform_create(self, serializer):
        serializer.save(student=self.request.user)

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from users.models import Enrollment
from courses.serializers import MinimalCourseSerializer

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def EnrolledCoursesView(request):
    enrollments = Enrollment.objects.filter(user=request.user).select_related('course')
    courses = [en.course for en in enrollments]
    serializer = MinimalCourseSerializer(courses, many=True)
    return Response(serializer.data)

from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import RetrieveAPIView, ListAPIView
from .serializers import (
    StudentCourseDetailSerializer,
    LectureSerializer,
    NoteSerializer,
    EnrolledUserSerializer
)
from courses.models import Course, Lecture, Note
from users.models import Enrollment, CustomUser
from rest_framework.exceptions import PermissionDenied

def check_enrollment(user, course_id):
    if not Enrollment.objects.filter(user=user, course__course_id=course_id).exists():
        raise PermissionDenied("You are not enrolled in this course.")

class StudentCourseDetailView(RetrieveAPIView):
    serializer_class = StudentCourseDetailSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        # After (correct)
        course_id = self.kwargs['course_id']
        check_enrollment(self.request.user, course_id)
        return Course.objects.get(course_id=course_id)


class StudentCourseLecturesView(ListAPIView):
    serializer_class = LectureSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        course_id = self.kwargs['course_id']
        check_enrollment(self.request.user, course_id)
        return Lecture.objects.filter(course__course_id=course_id)



class StudentCourseNotesView(ListAPIView):
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        course_id = self.kwargs['course_id']
        check_enrollment(self.request.user, course_id)
        return Note.objects.filter(course__course_id=course_id)


class EnrolledUsersView(ListAPIView):
    serializer_class = EnrolledUserSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        course_id = self.kwargs['course_id']
        check_enrollment(self.request.user, course_id)
        return CustomUser.objects.filter(enrollments__course__course_id=course_id)
