from rest_framework import serializers
from .models import InstructorProfile
from django.contrib.auth import get_user_model

User = get_user_model()

class InstructorProfileSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source='user.get_full_name', read_only=True)
    email = serializers.EmailField(source='user.email', read_only=True)

    class Meta:
        model = InstructorProfile
        fields = ['id', 'name', 'email', 'phone', 'website', 'bio', 'image']
