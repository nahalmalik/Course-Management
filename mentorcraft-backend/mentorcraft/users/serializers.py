# user/serializers.py
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import get_user_model
from .models import CustomUser,Order, OrderItem, Enrollment
from .utils import get_tokens_for_user  
from courses.models import Course
from users.models import CustomUser


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

class OrderItemSerializer(serializers.ModelSerializer):
    course_title = serializers.CharField(source='course.title', read_only=True)
    course_id = serializers.UUIDField(source='course.course_id', read_only=True)
    instructor = serializers.CharField(source='course.instructor', read_only=True)
    course_image = serializers.ImageField(source='course.image', read_only=True)

    class Meta:
        model = OrderItem
        fields = ['id', 'course_id', 'course_title', 'instructor', 'course_image']

class OrderSerializer(serializers.ModelSerializer):
    items = serializers.ListField(
        child=serializers.UUIDField(), write_only=True
    )
    payment_screenshot = serializers.ImageField(required=False)

    class Meta:
        model = Order
        fields = [
            'id', 'order_id', 'user', 'full_name', 'email',
            'payment_screenshot', 'total_amount', 'created_at', 'items'
        ]
        read_only_fields = ['id', 'order_id', 'created_at', 'user']

    def create(self, validated_data):
        items_data = validated_data.pop('items')  # UUID list
        request = self.context.get('request')
        user = request.user if request else None

        # ✅ Create the order (exclude 'user' if it's already injected)
        # Clean validated_data to avoid duplicate 'user'
        validated_data.pop('user', None)  # 👈 this is important
        order = Order.objects.create(user=user, **validated_data)


        # ✅ Create OrderItems and Enrollments for each course
        for course_id in items_data:
            try:
                course = Course.objects.get(course_id=course_id)
                OrderItem.objects.create(order=order, course=course)
                Enrollment.objects.create(user=user, course=course, order=order)
            except Course.DoesNotExist:
                continue  # Skip invalid courses

        return order


class ReceiptSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = [
            'order_id', 'full_name', 'email', 'total_amount',
            'created_at', 'payment_screenshot', 'items'
        ]

class EnrollmentSerializer(serializers.ModelSerializer):
    course_title = serializers.CharField(source='course.title', read_only=True)
    course_image = serializers.ImageField(source='course.image', read_only=True)
    instructor = serializers.CharField(source='course.instructor', read_only=True)
    course_id = serializers.UUIDField(source='course.course_id')

    # ✅ Accept UUIDs using slug fields
    course = serializers.SlugRelatedField(
        queryset=Course.objects.all(),
        slug_field='course_id',
        write_only=True
    )
    order = serializers.SlugRelatedField(
        queryset=Order.objects.all(),
        slug_field='order_id',
        write_only=True
    )

    class Meta:
        model = Enrollment
        fields = [
            'id','course_id',
            'course', 'order',           # ✅ writable
            'course_title', 'course_image', 'instructor',
            'order_id', 'enrolled_at'    # ✅ readable
        ]

class InstructorEnrollmentSerializer(serializers.ModelSerializer):
    course_title = serializers.CharField(source='course.title', read_only=True)
    student_name = serializers.CharField(source='user.first_name', read_only=True)
    student_email = serializers.EmailField(source='user.email', read_only=True)
    price = serializers.DecimalField(source='course.price', max_digits=8, decimal_places=2, read_only=True)
    enrolled_at = serializers.DateTimeField(format="%Y-%m-%d %H:%M:%S")

    class Meta:
        model = Enrollment
        fields = [
            'id',
            'course_title',
            'student_name',
            'student_email',
            'price',
            'enrolled_at'
        ]

class EnrollmentReceiptSerializer(serializers.ModelSerializer):
    course_title = serializers.CharField(source='course.title', read_only=True)
    course_image = serializers.ImageField(source='course.image', read_only=True)
    instructor = serializers.CharField(source='course.instructor', read_only=True)
    order_id = serializers.CharField(source='order.order_id', read_only=True)
    order_total = serializers.DecimalField(source='order.total_amount', max_digits=10, decimal_places=2, read_only=True)
    order_items = serializers.SerializerMethodField()

    class Meta:
        model = Enrollment
        fields = [
            'id',
            'course_title',
            'course_image',
            'instructor',
            'enrolled_at',
            'order_id',
            'order_total',
            'order_items',
        ]

    def get_order_items(self, obj):
        items = obj.order.items.all() if obj.order else []
        return [
            {
                "course_title": item.course.title,
                "course_id": item.course.course_id,
                "course_image": self.context['request'].build_absolute_uri(item.course.image.url) if item.course.image else None,
                "instructor": item.course.instructor
            }
            for item in items
        ]