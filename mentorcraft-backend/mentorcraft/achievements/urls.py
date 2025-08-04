# achievements/urls.py
from django.urls import path
from .views import (
    ExperienceView,
    MyBadgesView,
    MyCertificatesView,
    MyActivitiesView,
    AllBadgesView
)

urlpatterns = [
    path('experience/', ExperienceView.as_view(), name='student-experience'),
    path('badges/', MyBadgesView.as_view(), name='student-badges'),
    path('certificates/', MyCertificatesView.as_view(), name='student-certificates'),
    path('activities/', MyActivitiesView.as_view(), name='student-activities'),
    path('all-badges/', AllBadgesView.as_view(), name='all-badges'),  # Optional
]
