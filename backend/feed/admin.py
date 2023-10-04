from django.contrib import admin
from feed.models import Feed, Like


@admin.register(Feed)
class FeedAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "owner",
        "content",
        "created_at",
        "updated_at",
    )


@admin.register(Like)
class LikeAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "user",
        "feed",
        "created_at",
    )
