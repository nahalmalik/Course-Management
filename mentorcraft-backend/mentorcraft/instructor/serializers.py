from rest_framework import serializers
from .models import InstructorProfile, Announcement,InstructorCourseAnalytics, MonthlyAnalytics
from django.contrib.auth import get_user_model
from rest_framework.serializers import ImageField
from student.models import AssignmentSubmission,QuizAttempt

User = get_user_model()

class InstructorProfileSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source='user.get_full_name', read_only=True)
    email = serializers.EmailField(source='user.email', read_only=True)
    image = ImageField(use_url=True) 

    class Meta:
        model = InstructorProfile
        fields = ['id', 'name', 'email', 'phone', 'website', 'bio', 'image']


class AnnouncementSerializer(serializers.ModelSerializer):
    course_title = serializers.CharField(source='course.title', read_only=True)
    instructor_email = serializers.EmailField(source='instructor.email', read_only=True)

    class Meta:
        model = Announcement
        fields = [
            'id', 'course', 'course_title',
            'instructor', 'instructor_email',
            'title', 'content', 'type',
            'is_urgent', 'publish_immediately',
            'created_at'
        ]
        read_only_fields = ['id', 'instructor', 'created_at']

class MonthlyAnalyticsSerializer(serializers.ModelSerializer):
    class Meta:
        model = MonthlyAnalytics
        fields = ['id', 'month', 'year', 'earnings', 'enrollments', 'quiz_average']
        
class InstructorCourseAnalyticsSerializer(serializers.ModelSerializer):
    course_title = serializers.CharField(source='course.title', read_only=True)
    monthly_data = MonthlyAnalyticsSerializer(source='monthlyanalytics_set', many=True, read_only=True)

    class Meta:
        model = InstructorCourseAnalytics
        fields = [
            'id', 'instructor', 'course', 'course_title',
            'total_earnings', 'enrollments', 'average_quiz_score',
            'rating', 'completion_rate', 'last_synced',
            'monthly_data'  # 👈 This is where we connect monthly analytics
        ]

class InstructorAssignmentSubmissionSerializer(serializers.ModelSerializer):
    student_name = serializers.SerializerMethodField()
    student_email = serializers.SerializerMethodField()
    submitted_file_url = serializers.SerializerMethodField()

    class Meta:
        model = AssignmentSubmission
        fields = ['id', 'assignment', 'student_name', 'student_email', 'submitted_file_url']

    def get_student_name(self, obj):
        return obj.student.get_full_name() or obj.student.email

    def get_student_email(self, obj):
        return obj.student.email

    def get_submitted_file_url(self, obj):
        request = self.context.get('request')
        return request.build_absolute_uri(obj.submitted_file.url) if request and obj.submitted_file else None

class InstructorQuizAttemptSerializer(serializers.ModelSerializer):
    student_name = serializers.SerializerMethodField()
    student_email = serializers.SerializerMethodField()
    quiz_title = serializers.CharField(source='quiz.title', read_only=True)

    class Meta:
        model = QuizAttempt
        fields = ['id', 'quiz', 'quiz_title', 'student_name', 'student_email', 'attempt_number', 'score', 'completed_at']

    def get_student_name(self, obj):
        return obj.student.get_full_name() or obj.student.email

    def get_student_email(self, obj):
        return obj.student.email