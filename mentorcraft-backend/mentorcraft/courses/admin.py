from django.contrib import admin
from .models import Course,Assignment,Note,Lecture,Quiz,QuizQuestion,QuizOption

@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ('title', 'instructor', 'price', 'duration', 'category')
    list_filter = ('category', 'instructor')
    search_fields = ('title', 'instructor', 'instructor_email')

admin.site.register(Note)
admin.site.register(Assignment)
admin.site.register(Lecture)
admin.site.register(Quiz)
admin.site.register(QuizQuestion)
admin.site.register(QuizOption)