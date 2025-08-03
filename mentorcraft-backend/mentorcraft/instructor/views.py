# instructor/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import InstructorProfile, Announcement, InstructorCourseAnalytics
from .serializers import InstructorProfileSerializer, AnnouncementSerializer, InstructorCourseAnalyticsSerializer,InstructorQuizAttemptSerializer
from rest_framework import generics, permissions
from .models import InstructorCourseAnalytics
from django_filters.rest_framework import DjangoFilterBackend
from courses.models import Course,Assignment,Quiz
from rest_framework.generics import ListAPIView, RetrieveUpdateAPIView
from student.models import AssignmentSubmission,QuizAttempt
from .serializers import InstructorAssignmentSubmissionSerializer
from courses.serializers import AssignmentSerializer,QuizSerializer

class InstructorProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        profile, _ = InstructorProfile.objects.get_or_create(user=request.user)
        serializer = InstructorProfileSerializer(profile)
        return Response(serializer.data)

    def put(self, request):
        profile, _ = InstructorProfile.objects.get_or_create(user=request.user)
        serializer = InstructorProfileSerializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)
    
class AnnouncementListCreateView(generics.ListCreateAPIView):
    serializer_class = AnnouncementSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Announcement.objects.filter(instructor=self.request.user)

    def perform_create(self, serializer):
        serializer.save(instructor=self.request.user)

class AnnouncementDeleteView(generics.DestroyAPIView):
    queryset = Announcement.objects.all()
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Announcement.objects.filter(instructor=self.request.user)
    

class InstructorAnalyticsListView(generics.ListAPIView):
    serializer_class = InstructorCourseAnalyticsSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        print("🔍 Instructor (request.user):", self.request.user)
        return InstructorCourseAnalytics.objects.filter(instructor=self.request.user)

    
class SyncAnalyticsView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        courses = Course.objects.filter(instructor=user)

        for course in courses:
            InstructorCourseAnalytics.objects.get_or_create(
                instructor=user,
                course=course,
                defaults={
                    "earnings": 0,
                    "quiz_performance": 0,
                    "enrollments": 0
                }
            )
        return Response({"message": "Analytics synced successfully."})
    
class AnalyticsListView(generics.ListAPIView):
    queryset = InstructorCourseAnalytics.objects.all()
    serializer_class = InstructorCourseAnalyticsSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['course', 'instructor']  # Optional
    permission_classes = [IsAuthenticated]

class InstructorAssignmentListView(ListAPIView):
    serializer_class = InstructorAssignmentSubmissionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return AssignmentSubmission.objects.filter(
            assignment__course__instructor_email=self.request.user.email
        )

    def get_serializer_context(self):
        return {'request': self.request}



class InstructorAssignmentUpdateView(RetrieveUpdateAPIView):
    serializer_class = InstructorAssignmentSubmissionSerializer
    permission_classes = [IsAuthenticated]
    queryset = AssignmentSubmission.objects.all()

    def get_queryset(self):
        return AssignmentSubmission.objects.filter(
            assignment__course__instructor=self.request.user
        )
    
class InstructorOwnAssignmentsView(generics.ListAPIView):
    serializer_class = AssignmentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Match course__instructor_email with the logged-in user's email
        return Assignment.objects.filter(course__instructor_email=self.request.user.email)

class InstructorOwnQuizzesView(generics.ListAPIView):
    serializer_class = QuizSerializer  # ✅ You should already have this
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Quiz.objects.filter(course__instructor_email=self.request.user.email)
    
class InstructorQuizAttemptsListView(generics.ListAPIView):
    serializer_class = InstructorQuizAttemptSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return QuizAttempt.objects.filter(
            quiz__course__instructor_email=self.request.user.email
        )