from rest_framework import serializers
from .models import Course, Note, Assignment, Lecture, Quiz, QuizQuestion, QuizOption


class CourseSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = Course
        fields = '__all__'

    def get_image(self, obj):
        request = self.context.get('request')
        if obj.image:
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


class QuizOptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuizOption
        fields = ['id', 'text']


class QuizQuestionSerializer(serializers.ModelSerializer):
    options = QuizOptionSerializer(many=True, read_only=True)

    class Meta:
        model = QuizQuestion
        fields = ['id', 'question_text', 'explanation', 'question_type', 'points', 'options']


class QuizSerializer(serializers.ModelSerializer):
    questions = QuizQuestionSerializer(many=True, read_only=True)  

    class Meta:
        model = Quiz
        fields = [
            'id', 'course', 'title', 'description', 'time_limit', 'attempts_allowed',
            'passing_percentage', 'created_at', 'is_draft', 'questions'
        ]


class QuizOptionCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuizOption
        fields = ['text', 'is_correct']


class QuizQuestionCreateSerializer(serializers.ModelSerializer):
    options = QuizOptionCreateSerializer(many=True)

    class Meta:
        model = QuizQuestion
        fields = ['question_text', 'explanation', 'question_type', 'points', 'options']


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