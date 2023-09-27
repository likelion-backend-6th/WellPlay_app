from django.db import models
from django.contrib.auth.models import User


class Feed(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField(max_length=256)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    feed_img = models.URLField(null=True, blank=True)
    feed_video = models.URLField(null=True, blank=True)

    def __str__(self):
        return f"Feed by {self.owner.username}"


class Comment(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    feed = models.ForeignKey(Feed, on_delete=models.CASCADE)  # 무슨 feed의 댓글인지
    content = models.TextField(max_length=64)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Comment by {self.owner.username}"


class Like(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    feed = models.ForeignKey(Feed, on_delete=models.CASCADE)
