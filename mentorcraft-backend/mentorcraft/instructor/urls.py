from django.urls import path
from .views import InstructorProfileView,AnnouncementListCreateView, AnnouncementDeleteView, InstructorAnalyticsListView, SyncAnalyticsView, AnalyticsListView,InstructorAssignmentListView,InstructorAssignmentUpdateView
from .views import InstructorOwnAssignmentsView,InstructorOwnQuizzesView,InstructorQuizAttemptsListView

urlpatterns = [
    path('profile/', InstructorProfileView.as_view(), name='instructor-profile'),
     path('announcements/', AnnouncementListCreateView.as_view(), name='announcement-list-create'),
    path('announcements/<int:pk>/', AnnouncementDeleteView.as_view(), name='announcement-delete'),
    path('analytics/', InstructorAnalyticsListView.as_view(), name='instructor-analytics'),
    path('analytics/sync/', SyncAnalyticsView.as_view(), name='analytics-sync'),
    path('analytics/', AnalyticsListView.as_view(), name='analytics-list'),
    path('assignment-submissions/', InstructorAssignmentListView.as_view(), name='instructor-assignments'),
    path('assignment-submissions/<int:pk>/', InstructorAssignmentUpdateView.as_view(), name='grade-assignment'),
    path('assignments/', InstructorOwnAssignmentsView.as_view(), name='instructor-own-assignments'),
     path('quizzes/', InstructorOwnQuizzesView.as_view(), name='instructor-own-quizzes'),
    path('quiz-attempts/', InstructorQuizAttemptsListView.as_view(), name='instructor-quiz-attempts'),
]
