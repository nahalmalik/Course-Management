# achievements/admin.py
from django.contrib import admin
from .models import (
    Experience,
    Badge,
    StudentBadge,
    Certificate,
    AchievementActivity
)

admin.site.register(Experience)
admin.site.register(Badge)
admin.site.register(StudentBadge)
admin.site.register(Certificate)
admin.site.register(AchievementActivity)
