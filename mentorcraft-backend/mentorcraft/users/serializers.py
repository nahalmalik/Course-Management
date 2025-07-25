from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import get_user_model
from .models import CustomUser
from .utils import get_tokens_for_user  

User = get_user_model()

class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['email', 'username', 'password', 'role']  # ← ✅ correct field name

    def create(self, validated_data):
        user = CustomUser.objects.create_user(
            email=validated_data['email'],
            username=validated_data['username'],
            password=validated_data['password'],
            role=validated_data['role']
        )
        return user

class StudentTokenObtainSerializer(TokenObtainPairSerializer):
    username_field = 'email'  # 👈 tell DRF to use email

    def validate(self, attrs):
        data = super().validate(attrs)

        if self.user.role != 'student':
            raise serializers.ValidationError("Only students can log in here.")

        data['user'] = {
            'id': self.user.id,
            'email': self.user.email,
            'name': f"{self.user.first_name} {self.user.last_name}".strip(),
            'role': self.user.role,
        }
        return data

class InstructorTokenObtainSerializer(TokenObtainPairSerializer):
    username_field = 'email'  # 👈 tell DRF to use email

    def validate(self, attrs):
        data = super().validate(attrs)

        if self.user.role != 'instructor':
            raise serializers.ValidationError("Only instructors can log in here.")

        data['user'] = {
            'id': self.user.id,
            'email': self.user.email,
            'name': f"{self.user.first_name} {self.user.last_name}".strip(),
            'role': self.user.role,
        }
        return data


class StudentSignupSerializer(serializers.ModelSerializer):
    name = serializers.CharField(write_only=True)
    confirm = serializers.CharField(write_only=True)

    class Meta:
        model = CustomUser
        fields = ['name', 'email', 'password', 'confirm']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def validate(self, data):
        if data['password'] != data['confirm']:
            raise serializers.ValidationError({"confirm": "Passwords do not match."})
        return data

    def create(self, validated_data):
      name = validated_data.pop('name')
      validated_data.pop('confirm')

      email = validated_data['email']

      user = CustomUser.objects.create_user(
            username=email,  # Use email as unique username
            email=email,
            password=validated_data['password'],
            first_name=name,
            role='student'  # Make sure to set this!
        )
      return user


class InstructorSignupSerializer(serializers.ModelSerializer):
    name = serializers.CharField(write_only=True)
    confirm = serializers.CharField(write_only=True)

    class Meta:
        model = CustomUser
        fields = ['name', 'email', 'password', 'confirm']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def validate(self, data):
        if data['password'] != data['confirm']:
            raise serializers.ValidationError({"confirm": "Passwords do not match."})
        return data

    def create(self, validated_data):
        name = validated_data.pop('name')
        validated_data.pop('confirm')

        email = validated_data['email']

        user = CustomUser.objects.create_user(
            username=email,  # Use email as unique username
            email=email,
            password=validated_data['password'],
            first_name=name,
            role='instructor'  # Make sure to set this!
        )
        return user

