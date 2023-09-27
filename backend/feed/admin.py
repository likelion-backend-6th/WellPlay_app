from django.contrib import admin
from feed.models import Feed


@admin.register(Feed)
class FeedAdmin(admin.ModelAdmin):
    list_display = ("id", "owner", "content", "created_at", "updated_at")
