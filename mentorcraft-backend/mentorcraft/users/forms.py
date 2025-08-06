# users/forms.py
from django import forms
from django.contrib.auth.forms import ReadOnlyPasswordHashField
from .models import CustomUser

class CustomUserChangeForm(forms.ModelForm):
    password = ReadOnlyPasswordHashField(label="Password")

    class Meta:
        model = CustomUser
        fields = ('email', 'username', 'role', 'is_active', 'is_staff', 'is_superuser')

    def clean_password(self):
        return self.initial["password"]
