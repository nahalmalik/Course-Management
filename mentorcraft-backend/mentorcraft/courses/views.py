#courses/views.py
from rest_framework import generics,viewsets,permissions,status
from .models import Course,Assignment,Note,Lecture,Quiz
from .serializers import CourseSerializer,NoteSerializer,AssignmentSerializer,QuizSerializer,LectureSerializer,QuizCreateSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

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

class NoteViewSet(viewsets.ModelViewSet):
    queryset = Note.objects.all()
    serializer_class = NoteSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        course_id = self.request.query_params.get("course_id")
        if course_id:
            return Note.objects.filter(course__id=course_id)
        return Note.objects.none()

class AssignmentViewSet(viewsets.ModelViewSet):
    queryset = Assignment.objects.all()
    serializer_class = AssignmentSerializer
    permission_classes = [IsAuthenticated]

class LectureViewSet(viewsets.ModelViewSet):
    queryset = Lecture.objects.all()
    serializer_class = LectureSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        course_id = self.request.query_params.get("course_id")
        if course_id:
            return Lecture.objects.filter(course__id=course_id)
        return Lecture.objects.none()
    
        


class QuizViewSet(viewsets.ModelViewSet):
    queryset = Quiz.objects.all()
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.action in ['list', 'retrieve']:
            return QuizSerializer  # Student-friendly
        return QuizCreateSerializer  # Instructor-facing (write)

    def get_serializer_context(self):
        return {'request': self.request}

