from django.contrib import admin
from feed.models import Feed, Like, Comment


class CommentInline(admin.StackedInline):
    model = Comment
    can_delete = False
    verbose_name_plural = "Comment"


@admin.register(Feed)
class FeedAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "owner",
        "content",
        "created_at",
        "updated_at",
    )
    inlines = (CommentInline,)


@admin.register(Like)
class LikeAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "user",
        "feed",
        "created_at",
    )
