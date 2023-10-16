from django.contrib import admin
from .models import User, Follow, Profile, Infolol, Infoval


class ProfileInline(admin.StackedInline):
    model = Profile
    can_delete = False
    verbose_name_plural = "Profile"


class InfololInline(admin.StackedInline):
    model = Infolol
    can_delete = False
    verbose_name_plural = "Infolol"


class InfovalInline(admin.StackedInline):
    model = Infoval
    can_delete = False
    verbose_name_plural = "Infoval"


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "user_id",
        "email",
        "is_superuser",
        "is_active",
        "created_at",
        "updated_at",
    )
    inlines = (ProfileInline, InfololInline, InfovalInline)


@admin.register(Follow)
class FollowAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "from_user",
        "to_user",
    )
