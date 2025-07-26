from django.urls import path
from .views import RegisterView, CustomTokenObtainPairView,StudentTokenView, InstructorTokenView,StudentSignupView,InstructorSignupView
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', CustomTokenObtainPairView.as_view(), name='jwt-login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('login/student/', StudentTokenView.as_view(), name='student_login'),
    path('login/instructor/', InstructorTokenView.as_view(), name='instructor_login'),
    path('signup/student/', StudentSignupView.as_view(), name='student-signup'),
    path('signup/instructor/', InstructorSignupView.as_view(), name='instructor-signup'),
]
