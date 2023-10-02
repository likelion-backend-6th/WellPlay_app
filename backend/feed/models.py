from django.conf import settings
from django.db import models

from common.models import CommonModel


class Feed(CommonModel):
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    content = models.TextField(max_length=256)
    image_url = models.URLField(null=True, blank=True)
    video_url = models.URLField(null=True, blank=True)

    indexes = [
        models.Index(fields=["-created_at"]),
    ]
    ordering = ["-created_at"]

    def __str__(self):
        return f"Feed by {self.owner.user_id}"

    def access_by_feed(self, user: settings.AUTH_USER_MODEL):
        return self.owner == user or user.is_superuser


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
    feed = models.ForeignKey(Feed, on_delete=models.CASCADE, related_name="likes")
    created_at = models.DateTimeField(auto_now_add=True)
