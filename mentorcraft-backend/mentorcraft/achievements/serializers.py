# achievements/serializers.py
from rest_framework import serializers
from .models import (
    Experience,
    Badge,
    StudentBadge,
    Certificate,
    AchievementActivity
)


class BadgeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Badge
        fields = ['id', 'name', 'description', 'icon', 'created_at']

class StudentBadgeSerializer(serializers.ModelSerializer):
    badge = BadgeSerializer(read_only=True)

    class Meta:
        model = StudentBadge
        fields = ['id', 'badge', 'awarded_at']


class CertificateSerializer(serializers.ModelSerializer):
    course_title = serializers.CharField(source='course.title', read_only=True)

    class Meta:
        model = Certificate
        fields = ['id', 'course', 'course_title', 'file', 'issued_at']


class AchievementActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = AchievementActivity
        fields = ['id', 'action', 'xp_earned', 'timestamp']


class ExperienceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Experience
        fields = ['id', 'xp', 'level', 'updated_at']
