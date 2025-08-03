from django.contrib import admin
from .models import StudentProfile,Review, InstructorReply, Notification,StudentDiscussion
from .models import AssignmentSubmission, QuizAttempt, QuizAnswer, StudentNotification, InstructorNotification

@admin.register(StudentProfile)
class StudentProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'phone', 'bio', 'image')
    search_fields = ('user__username', 'user__email', 'phone')

@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('student', 'course', 'rating', 'created_at')
    list_filter = ('course', 'rating')

@admin.register(InstructorReply)
class InstructorReplyAdmin(admin.ModelAdmin):
    list_display = ('instructor', 'review', 'created_at')

@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ('user', 'message', 'is_read', 'created_at')


admin.site.register(AssignmentSubmission)
admin.site.register(QuizAttempt)
admin.site.register(QuizAnswer)
admin.site.register(StudentNotification)
admin.site.register(InstructorNotification)

@admin.register(StudentDiscussion)
class StudentDiscussionAdmin(admin.ModelAdmin):
    list_display = ('title', 'student', 'course', 'category', 'is_urgent', 'created_at')
    list_filter = ('category', 'is_urgent')
    search_fields = ('title', 'student__email', 'course__title')