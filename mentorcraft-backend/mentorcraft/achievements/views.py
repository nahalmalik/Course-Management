# achievements/views.py
from rest_framework import generics, permissions
from .models import (
    Experience,
    StudentBadge,
    Certificate,
    AchievementActivity,
    Badge
)
from .serializers import (
    ExperienceSerializer,
    StudentBadgeSerializer,
    CertificateSerializer,
    AchievementActivitySerializer,
    BadgeSerializer
)


# 1. Get current user's experience
class ExperienceView(generics.RetrieveAPIView):
    serializer_class = ExperienceSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return Experience.objects.get_or_create(student=self.request.user)[0]


# 2. Get current user's badges
# views.py
class MyBadgesView(generics.ListAPIView):
    serializer_class = StudentBadgeSerializer  # must return student-specific badges
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return StudentBadge.objects.filter(student=self.request.user)



# 3. Get current user's certificates
class MyCertificatesView(generics.ListAPIView):
    serializer_class = CertificateSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Certificate.objects.filter(student=self.request.user)


# 4. Get current user's activity logs
class MyActivitiesView(generics.ListAPIView):
    serializer_class = AchievementActivitySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return AchievementActivity.objects.filter(student=self.request.user).order_by('-timestamp')


# 5. (Optional) List all badges in system (for admin/stats)
class AllBadgesView(generics.ListAPIView):
    queryset = Badge.objects.all()
    serializer_class = BadgeSerializer
    permission_classes = [permissions.IsAuthenticated]
