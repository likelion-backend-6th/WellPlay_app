from django.contrib import admin
from .models import User, Follow, Profile, Infolol


class InfololInline(admin.StackedInline):  # 나중에 알아보고 추가.
    model = Infolol
    can_delete = False
    verbose_name_plural = "Infolol"


class ProfileInline(admin.StackedInline):
    model = Profile
    can_delete = False
    verbose_name_plural = "Profile"
    inlines = (InfololInline,)


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
    inlines = (ProfileInline,)


@admin.register(Follow)
class FollowAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "from_user",
        "to_user",
    )
