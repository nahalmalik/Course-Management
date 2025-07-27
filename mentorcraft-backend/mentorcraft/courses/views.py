from rest_framework import generics
from .models import Course
from .serializers import CourseSerializer

class CourseListCreateView(generics.ListCreateAPIView):
    serializer_class = CourseSerializer

    def get_queryset(self):
     email = self.request.query_params.get('instructor_email')
     if email:
        return Course.objects.filter(instructor_email=email)
     return Course.objects.all()


    def get_serializer_context(self):
        return {'request': self.request}


class CourseRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer

    def get_serializer_context(self):
        return {'request': self.request}

