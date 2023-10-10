from rest_framework import serializers
from .models import Feed, Comment, Notification, Like


class FeedSerializer(serializers.ModelSerializer):
    class Meta:
        model = Feed
        fields = "__all__"
        read_only_fields = (
            "id",
            "owner",
            "created_at",
            "updated_at",
        )

    like = serializers.SerializerMethodField()
    comment = serializers.SerializerMethodField()
    user_id = serializers.SerializerMethodField()
    profile_image = serializers.SerializerMethodField()

    def get_like(self, obj) -> int:
        return Like.objects.filter(feed=obj).count()

    def get_comment(self, obj) -> int:
        return Comment.objects.filter(feed=obj).count()

    def get_user_id(self, obj) -> str:
        return obj.owner.user_id if obj.owner else ""

    def get_profile_image(self, obj) -> str:
        return obj.owner.profile.image_url if obj.owner else ""


class FeedUploadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Feed
        fields = [
            "content",
            "image",
            "video",
        ]
        read_only_fields = ("owner", "created_at", "updated_at")

    image = serializers.ImageField(use_url=True)
    video = serializers.FileField(use_url=True)


class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = "__all__"
        read_only_fields = (
            "id",
            "feed",
            "owner",
            "created_at",
            "updated_at",
        )


class LikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Like
        fields = "__all__"
        read_only_fields = ("created_at",)


class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = "__all__"
