from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser,Order, OrderItem, Enrollment
from firebase_sync.firebase_helpers import is_user_synced_to_firebase

@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    list_display = ('email', 'username', 'get_role', 'is_active', 'is_staff', 'synced_to_firebase')
    list_filter = ('role', 'is_staff', 'is_superuser')

    def get_role(self, obj):
        return obj.role
    get_role.short_description = 'Role'

    fieldsets = (
        (None, {'fields': ('email', 'username', 'password')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Role Info', {'fields': ('role',)}),
        ('Important dates', {'fields': ('last_login',)}),
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'username', 'role', 'password1', 'password2'),
        }),
    )
    search_fields = ('email', 'username')
    ordering = ('email',)

    def synced_to_firebase(self, obj):
        return is_user_synced_to_firebase(obj)
    synced_to_firebase.boolean = True  # ✅ Shows as ✅ or ❌ in admin list
    synced_to_firebase.short_description = "Synced to Firebase"
admin.site.register(Order)
admin.site.register(OrderItem)
admin.site.register(Enrollment)