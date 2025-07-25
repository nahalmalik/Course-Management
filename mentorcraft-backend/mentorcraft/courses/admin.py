from django.contrib import admin
from .models import Course

@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ('title', 'instructor', 'price', 'duration', 'category')
    list_filter = ('category', 'instructor')
    search_fields = ('title', 'instructor', 'instructor_email')
