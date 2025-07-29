from django.urls import path
from .views import InstructorProfileView,AnnouncementListCreateView, AnnouncementDeleteView, InstructorAnalyticsListView, SyncAnalyticsView, AnalyticsListView

urlpatterns = [
    path('profile/', InstructorProfileView.as_view(), name='instructor-profile'),
     path('announcements/', AnnouncementListCreateView.as_view(), name='announcement-list-create'),
    path('announcements/<int:pk>/', AnnouncementDeleteView.as_view(), name='announcement-delete'),
    path('analytics/', InstructorAnalyticsListView.as_view(), name='instructor-analytics'),
    path('analytics/sync/', SyncAnalyticsView.as_view(), name='analytics-sync'),
    path('analytics/', AnalyticsListView.as_view(), name='analytics-list'),

]
