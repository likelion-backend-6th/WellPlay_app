from django.conf import settings
from django.db import models
from django_prometheus.models import ExportModelOperationsMixin

from common.models import CommonModel


class Feed(ExportModelOperationsMixin("feed"), CommonModel):
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="feed_owner"
    )
    content = models.TextField(max_length=256)
    image_url = models.URLField(null=True, blank=True)
    video_url = models.URLField(null=True, blank=True)
    likes: models.QuerySet["Like"]

    indexes = [
        models.Index(fields=["-created_at"]),
    ]
    ordering = ["-created_at"]

    def __str__(self):
        return f"Feed{self.id} by {self.owner.user_id}"

    def access_by_feed(self, user: settings.AUTH_USER_MODEL):
        return self.owner == user or user.is_superuser


class Comment(ExportModelOperationsMixin("comment"), CommonModel):
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    feed = models.ForeignKey(Feed, on_delete=models.CASCADE)
    content = models.TextField(max_length=64)

    indexes = [
        models.Index(fields=["-created_at"]),
    ]
    ordering = ["-created_at"]

    def __str__(self):
        return f"Comment by {self.owner.user_id}"

    def access_by_comment(self, user: settings.AUTH_USER_MODEL):
        return self.owner == user or user.is_superuser


class Like(ExportModelOperationsMixin("like"), models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    feed = models.ForeignKey(Feed, on_delete=models.CASCADE, related_name="likes")
    created_at = models.DateTimeField(auto_now_add=True)

    indexes = [
        models.Index(fields=["-created_at"]),
    ]
    ordering = ["-created_at"]


class Notification(ExportModelOperationsMixin("notification"), models.Model):
    sender = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="sent_notifications",
    )
    receiver = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="received_notifications",
    )
    message = models.CharField(max_length=255)
    notification_type = models.CharField(max_length=32)
