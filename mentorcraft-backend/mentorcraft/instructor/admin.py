from django.contrib import admin
from .models import InstructorProfile, Announcement,InstructorCourseAnalytics,MonthlyAnalytics

@admin.register(InstructorProfile)
class InstructorProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'phone', 'website')

@admin.register(Announcement)
class AnnouncementAdmin(admin.ModelAdmin):
    list_display = ('title', 'course', 'instructor', 'type', 'is_urgent', 'publish_immediately', 'created_at')
    list_filter = ('type', 'is_urgent', 'publish_immediately', 'created_at')
    search_fields = ('title', 'content', 'instructor__email', 'course__title')

@admin.register(InstructorCourseAnalytics)
class InstructorCourseAnalyticsAdmin(admin.ModelAdmin):
    list_display = ('course', 'instructor', 'total_earnings', 'enrollments', 'average_quiz_score', 'rating')
    search_fields = ('course__title', 'instructor__email')
    list_filter = ('instructor',)

@admin.register(MonthlyAnalytics)
class MonthlyAnalyticsAdmin(admin.ModelAdmin):
    pass
    