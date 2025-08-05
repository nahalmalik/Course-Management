from django.contrib import admin
from .models import Course,Assignment,Note,Lecture,Quiz,QuizQuestion,QuizOption
from firebase_admin import firestore

@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ('title', 'instructor', 'price', 'duration', 'category','firebase_status')
    list_filter = ('category', 'instructor')
    search_fields = ('title', 'instructor', 'instructor_email')
    
    def firebase_status(self, obj):
        try:
            db = firestore.client()
            doc_ref = db.collection('courses').document(str(obj.course_id))
            if doc_ref.get().exists:
                return "✅ Synced"
            else:
                return "❌ Not Synced"
        except Exception as e:
            return f"⚠️ Error"
    
    firebase_status.short_description = "Firebase Sync"
admin.site.register(Note)
admin.site.register(Assignment)
admin.site.register(Lecture)
admin.site.register(Quiz)
admin.site.register(QuizQuestion)
admin.site.register(QuizOption)