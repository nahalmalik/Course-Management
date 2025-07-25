from rest_framework import generics, permissions
from .serializers import RegisterSerializer
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .serializers import StudentTokenObtainSerializer, InstructorTokenObtainSerializer
from rest_framework.response import Response
from rest_framework import status
import uuid
from users.models import CustomUser
from rest_framework.views import APIView
from .serializers import StudentSignupSerializer, InstructorSignupSerializer

User = get_user_model()

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # Add custom claims
        token['username'] = user.username
        token['user_type'] = user.user_type
        return token

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class StudentTokenView(TokenObtainPairView):
    serializer_class = StudentTokenObtainSerializer

class InstructorTokenView(TokenObtainPairView):
    serializer_class = InstructorTokenObtainSerializer


class StudentSignupView(APIView):
    def post(self, request):
        name = request.data.get('name')
        email = request.data.get('email')
        password = request.data.get('password')
        confirm = request.data.get('confirm')

        if not all([name, email, password, confirm]):
            return Response({'error': 'All fields are required'}, status=400)
        if password != confirm:
            return Response({'error': 'Passwords do not match'}, status=400)
        if CustomUser.objects.filter(email=email).exists():
            return Response({'error': 'Email already exists'}, status=400)

        try:
            # ✅ Create user with auto-generated unique username
            user = CustomUser.objects.create_user(
                username=email.split('@')[0] + str(uuid.uuid4())[:5],
                email=email,
                password=password,
                role='student',
                first_name=name  # or split name into first_name / last_name
            )
            return Response({'message': 'Student registered successfully'}, status=201)
        except Exception as e:
            return Response({'error': str(e)}, status=500)

class InstructorSignupView(APIView):
    def post(self, request):
        serializer = InstructorSignupSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()

            # Optional: Generate JWT token
            from users.utils import get_tokens_for_user
            tokens = get_tokens_for_user(user)

            return Response({
                'message': 'Instructor registered successfully.',
                'user': {
                    'id': user.id,
                    'email': user.email,
                    'username': user.username,
                    'role': user.role,
                },
                'tokens': tokens  # access & refresh
            }, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)