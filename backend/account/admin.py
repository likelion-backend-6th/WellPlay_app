from django.contrib import admin
from .models import User


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('user_id', 'email', 'profile_name')
    list_filter = ('user_id',)
    search_fields = ('user_id', 'profile_name')
    ordering = ('user_id',)
