from rest_framework import generics, permissions
from .models import InstructorProfile
from .serializers import InstructorProfileSerializer

class InstructorProfileDetail(generics.RetrieveUpdateAPIView):
    serializer_class = InstructorProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user.instructor_profile
