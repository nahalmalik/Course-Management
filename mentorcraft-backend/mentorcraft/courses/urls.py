#courses/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    CourseListCreateView,
    CourseRetrieveUpdateDestroyView,
    NoteViewSet,
    AssignmentViewSet,
    LectureViewSet,
    QuizViewSet,

)

router = DefaultRouter()
router.register(r'notes', NoteViewSet)
router.register(r'assignments', AssignmentViewSet)
router.register(r'lectures', LectureViewSet)
router.register(r'quizzes', QuizViewSet)

urlpatterns = [
    path('', CourseListCreateView.as_view(), name='course-list-create'),
    path('<int:pk>/', CourseRetrieveUpdateDestroyView.as_view(), name='course-detail'),
    path('', include(router.urls)),  # ✅ Include router URLs
]
