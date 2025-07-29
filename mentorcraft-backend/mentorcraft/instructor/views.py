from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import InstructorProfile, Announcement, InstructorCourseAnalytics
from .serializers import InstructorProfileSerializer, AnnouncementSerializer, InstructorCourseAnalyticsSerializer
from rest_framework import generics, permissions
from .models import InstructorCourseAnalytics
from django_filters.rest_framework import DjangoFilterBackend
from courses.models import Course

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