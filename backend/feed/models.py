from django.conf import settings
from django.db import models

from common.models import CommonModel


class Feed(CommonModel):
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    content = models.TextField(max_length=256)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    feed_img = models.URLField(null=True, blank=True)
    feed_video = models.URLField(null=True, blank=True)

    indexes = [
        models.Index(fields=["-created_at"]),
    ]
    ordering = ["-created_at"]

    def __str__(self):
        return f"Feed by {self.owner.user_id}"


class Comment(CommonModel):
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    feed = models.ForeignKey(Feed, on_delete=models.CASCADE)
    content = models.TextField(max_length=64)

    indexes = [
        models.Index(fields=["-created_at"]),
    ]
    ordering = ["-created_at"]

    def __str__(self):
        return f"Comment by {self.owner.user_id}"


class Like(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    feed = models.ForeignKey(Feed, on_delete=models.CASCADE)


class Notification(models.Model):
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
