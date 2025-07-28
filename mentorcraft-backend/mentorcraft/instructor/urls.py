from django.urls import path
from .views import InstructorProfileDetail

urlpatterns = [
    path('profile/', InstructorProfileDetail.as_view(), name='instructor-profile'),
]
