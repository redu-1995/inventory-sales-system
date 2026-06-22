from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Role, User

admin.site.register(Role)

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    fieldsets = UserAdmin.fieldsets + (
        ('Custom Fields', {'fields': ('role', 'phone', 'status')}),
    )