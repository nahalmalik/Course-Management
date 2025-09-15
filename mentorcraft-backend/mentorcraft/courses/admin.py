from django.contrib import admin
from django import forms
from .models import Course, Assignment, Note, Lecture, Quiz, QuizQuestion, QuizOption

# --- Admin form for JSON and large text fields ---
class CourseAdminForm(forms.ModelForm):
    class Meta:
        model = Course
        fields = '__all__'
        widgets = {
            'faqs': forms.Textarea(attrs={'rows': 5, 'cols': 60}),
            'curriculum': forms.Textarea(attrs={'rows': 5, 'cols': 60}),
            'videos': forms.Textarea(attrs={'rows': 5, 'cols': 60}),
            'tags': forms.Textarea(attrs={'rows': 3, 'cols': 60}),
            'curriculum_intro': forms.Textarea(attrs={'rows': 3, 'cols': 60}),
            'overview': forms.Textarea(attrs={'rows': 3, 'cols': 60}),
        }

# --- Admin class ---
@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    form = CourseAdminForm
    list_display = ('title', 'instructor', 'price', 'duration', 'category')
    list_filter = ('category', 'instructor')
    search_fields = ('title', 'instructor', 'instructor_email')

# --- Register other models normally ---
admin.site.register(Note)
admin.site.register(Assignment)
admin.site.register(Lecture)
admin.site.register(Quiz)
admin.site.register(QuizQuestion)
admin.site.register(QuizOption)
