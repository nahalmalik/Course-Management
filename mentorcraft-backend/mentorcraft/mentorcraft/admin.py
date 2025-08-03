from django.contrib import admin
from django.contrib.admin import AdminSite

class MentorCraftAdminSite(AdminSite):
    site_header = "Mentor Craft Admin"
    site_title = "Mentor Craft Admin Portal"
    index_title = "Welcome to Mentor Craft Admin"

    def each_context(self, request):
        context = super().each_context(request)
        context['css_files'] = ['admin/css/custom-admin.css']
        return context

admin_site = MentorCraftAdminSite(name='mentorcraft_admin')
