from rest_framework import serializers
from .models import Course, Note, Assignment, Lecture, Quiz, QuizQuestion, QuizOption

# Course Serializer with image URL
class CourseSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = Course
        fields = '__all__'

    def get_image(self, obj):
        request = self.context.get('request')
        if obj.image and hasattr(obj.image, 'url'):
            return request.build_absolute_uri(obj.image.url)
        return None

# Notes, Assignments, Lectures
class NoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note
        fields = '__all__'

class AssignmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Assignment
        fields = '__all__'

class LectureSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lecture
        fields = '__all__'

# ✅ Student-Facing Option Serializer (no correct answer revealed)
class QuizOptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuizOption
        fields = ['id', 'text']

# ✅ Student-Facing Question Serializer
class QuizQuestionSerializer(serializers.ModelSerializer):
    options = QuizOptionSerializer(many=True, read_only=True)

    class Meta:
        model = QuizQuestion
        fields = ['id', 'question_text', 'explanation', 'question_type', 'points', 'options']

# ✅ Student-Facing Quiz Serializer (used in views and frontend)
class QuizSerializer(serializers.ModelSerializer):
    questions = QuizQuestionSerializer(many=True, read_only=True)  # ✅ this uses related_name

    class Meta:
        model = Quiz
        fields = [
            'id', 'course', 'title', 'description', 'time_limit', 'attempts_allowed',
            'passing_percentage', 'created_at', 'is_draft', 'questions'
        ]


# ✅ Instructor-Facing Option Serializer (for write)
class QuizOptionCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuizOption
        fields = ['text', 'is_correct']

# ✅ Instructor-Facing Question Serializer (for write)
class QuizQuestionCreateSerializer(serializers.ModelSerializer):
    options = QuizOptionCreateSerializer(many=True)

    class Meta:
        model = QuizQuestion
        fields = ['question_text', 'explanation', 'question_type', 'points', 'options']

# ✅ Instructor-Facing Quiz Creation Serializer
class QuizCreateSerializer(serializers.ModelSerializer):
    questions = QuizQuestionCreateSerializer(many=True)

    class Meta:
        model = Quiz
        fields = [
            'id',
            'title',
            'description',
            'time_limit',
            'attempts_allowed',
            'passing_percentage',
            'is_draft',
            'course',
            'questions'
        ]

    def create(self, validated_data):
        questions_data = validated_data.pop('questions', [])
        quiz = Quiz.objects.create(**validated_data)

        for q_data in questions_data:
            options_data = q_data.pop('options', [])
            question = QuizQuestion.objects.create(quiz=quiz, **q_data)
            for option_data in options_data:
                QuizOption.objects.create(question=question, **option_data)

        return quiz


class MinimalCourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = ['id', 'title', 'description']