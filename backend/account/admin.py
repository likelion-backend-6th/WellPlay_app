from django.contrib import admin
from .models import User


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = (
        "user_id",
        "email",
        "is_superuser",
        "is_active",
        "created_at",
        "updated_at",
    )
