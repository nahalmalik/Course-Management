from rest_framework import serializers
from .models import (
    StudentProfile, Review, InstructorReply, Notification,
    AssignmentSubmission, QuizAttempt, QuizAnswer,
    StudentNotification, InstructorNotification,StudentDiscussion
)
from courses.models import Course, Quiz, QuizQuestion, QuizOption, Assignment

# ──────── General ────────

class StudentProfileSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source='user.name', read_only=True)
    email = serializers.EmailField(source='user.email', read_only=True)

    class Meta:
        model = StudentProfile
        fields = ['name', 'email', 'phone', 'bio', 'image']


class CourseMiniSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = ['id', 'title', 'image', 'instructor_name', 'duration', 'lessons']


class ReviewSerializer(serializers.ModelSerializer):
    course_title = serializers.CharField(source='course.title', read_only=True)

    class Meta:
        model = Review
        fields = ['id', 'student', 'course', 'course_title', 'rating', 'comment', 'created_at']
        read_only_fields = ['student', 'created_at']


class InstructorReplySerializer(serializers.ModelSerializer):
    class Meta:
        model = InstructorReply
        fields = ['id', 'review', 'instructor', 'reply', 'created_at']
        read_only_fields = ['instructor', 'created_at']


class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ['id', 'user', 'message', 'is_read', 'created_at']


# ──────── Assignments ────────

class AssignmentSubmissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = AssignmentSubmission
        fields = '__all__'
        read_only_fields = ['student', 'submitted_at']


class AssignmentSerializer(serializers.ModelSerializer):
    status = serializers.SerializerMethodField()
    file_url = serializers.SerializerMethodField()

    class Meta:
        model = Assignment
        fields = ['id', 'title', 'description', 'due_date', 'file_url', 'status']

    def get_status(self, obj):
        user = self.context['request'].user
        submission = AssignmentSubmission.objects.filter(student=user, assignment=obj).first()
        if submission:
            return 'Graded' if submission.graded else 'Submitted'
        return 'Pending'

    def get_file_url(self, obj):
        return obj.file.url if obj.file else None


# ──────── Quiz Attempt & Answers ────────

class QuizAnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuizAnswer
        fields = ['question', 'selected_option']


class QuizAttemptSerializer(serializers.ModelSerializer):
    answers = QuizAnswerSerializer(many=True, required=False)

    class Meta:
        model = QuizAttempt
        fields = [
            'id', 'quiz', 'student', 'started_at', 'completed_at',
            'score', 'passed', 'attempt_number', 'answers'
        ]
        read_only_fields = ['student', 'started_at', 'score', 'passed']

    def create(self, validated_data):
        answers_data = validated_data.pop('answers', [])
        attempt = QuizAttempt.objects.create(**validated_data)
        for answer_data in answers_data:
            QuizAnswer.objects.create(attempt=attempt, **answer_data)
        return attempt


# ──────── Quiz Listing for Students ────────

class QuizOptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuizOption
        fields = ['id', 'text']


class QuizQuestionSerializer(serializers.ModelSerializer):
    options = QuizOptionSerializer(many=True, read_only=True)

    class Meta:
        model = QuizQuestion
        fields = ['id', 'question_text', 'options'] 



class StudentQuizListSerializer(serializers.ModelSerializer):
    course_title = serializers.CharField(source='course.title', read_only=True)
    your_attempts_count = serializers.SerializerMethodField()
    last_score = serializers.SerializerMethodField()
    passed = serializers.SerializerMethodField()
    questions = QuizQuestionSerializer(many=True, read_only=True)  # ✅ FIXED

    class Meta:
        model = Quiz
        fields = [
            'id',
            'title',
            'course_title',
            'attempts_allowed',
            'your_attempts_count',
            'last_score',
            'passed',
            'questions',
        ]

    def get_your_attempts_count(self, obj):
        user = self.context['request'].user
        return QuizAttempt.objects.filter(quiz=obj, student=user).count()

    def get_last_score(self, obj):
        user = self.context['request'].user
        last = QuizAttempt.objects.filter(quiz=obj, student=user).order_by('-completed_at').first()
        return last.score if last else None

    def get_passed(self, obj):
        user = self.context['request'].user
        last = QuizAttempt.objects.filter(quiz=obj, student=user).order_by('-completed_at').first()
        return last.passed if last else False


class SubmittedQuizAttemptSerializer(serializers.ModelSerializer):
    quiz_title = serializers.CharField(source='quiz.title')

    class Meta:
        model = QuizAttempt
        fields = ['id', 'quiz_title', 'attempt_number', 'completed_at']
        
# ──────── Notifications ────────

class StudentNotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentNotification
        fields = '__all__'


class InstructorNotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = InstructorNotification
        fields = '__all__'

# ──────── studnet discussion ────────

class StudentDiscussionSerializer(serializers.ModelSerializer):
    course_title = serializers.CharField(source='course.title', read_only=True)
    student_name = serializers.CharField(source='student.get_full_name', read_only=True)

    class Meta:
        model = StudentDiscussion
        fields = [
            'id', 'student', 'course', 'category',
            'title', 'content', 'is_urgent', 'created_at',
            'course_title', 'student_name',
        ]
        read_only_fields = ['student', 'created_at']

from courses.models import Course, Lecture, Note
from users.models import CustomUser, Enrollment
from rest_framework import serializers

class LectureSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lecture
        fields = ['id', 'title', 'description', 'duration', 'icon', 'video']

class NoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note
        fields = ['id', 'title', 'description', 'file', 'uploaded_at']

class EnrolledUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'first_name', 'last_name', 'email']

class StudentCourseDetailSerializer(serializers.ModelSerializer):
    instructor_name = serializers.SerializerMethodField()
    course_id = serializers.UUIDField(read_only=True)

    class Meta:
        model = Course
        fields = ['id', 'course_id', 'title', 'description', 'image', 'duration', 'instructor_name']

    def get_instructor_name(self, obj):
        return obj.instructor  # stored as name string in your model
