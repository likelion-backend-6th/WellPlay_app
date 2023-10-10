from rest_framework import serializers

from .models import User, Profile, Follow, Infolol


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "user_id", "email", "password"]
        read_only_fields = ("refresh",)
        # read_only_field = ('last_login', 'is_superuser', ' is_active', 'is_staff', 'groups', 'user_permissions')

    def create(self, validated_data):
        user = User.objects.create_user(
            user_id=validated_data["user_id"],
            email=validated_data["email"],
            password=validated_data["password"],
        )
        return user


# class ProfileLOLSerializer(serializers.ModelSerializer):
#     info_lol = InfoLolSerializer()  # InfoLol 정보를 포함

#     class Meta:
#         model = Profile
#         fields = ("id", "nickname", "image_url", "username_lol", "info_lol")

#     def update(self, instance, validated_data):
#         # Profile 모델의 필드 업데이트
#         for key, value in validated_data.items():
#             setattr(instance, key, value)

#         # InfoLol 모델의 json_lol 필드 업데이트
#         info_lol_data = validated_data.get("info_lol")
#         if info_lol_data:
#             info_lol, created = Infolol.objects.get_or_create(profile=instance)
#             for key, value in info_lol_data.items():
#                 setattr(info_lol, key, value)
#             info_lol.save()

#         instance.save()

#         return instance


class InfoLolSerializer(serializers.ModelSerializer):
    class Meta:
        model = Infolol
        fields = "__all__"

    def update(self, instance, validated_data):
        for key, value in validated_data.items():
            setattr(instance, key, value)
        instance.save()

        return instance


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ("id", "nickname", "image_url")

    def update(self, instance, validated_data):
        for key, value in validated_data.items():
            setattr(instance, key, value)
        instance.save()

        return instance


class FollowSerializer(serializers.ModelSerializer):
    class Meta:
        model = Follow
        fields = "__all__"
        read_only_fields = ("from_user",)


class FollowingListSerializer(serializers.ModelSerializer):
    from_user = serializers.ReadOnlyField(source="from_user.user_id")
    to_user = serializers.ReadOnlyField(source="to_user.user_id")

    class Meta:
        model = Follow
        fields = "__all__"


class FollowerListSerializer(serializers.ModelSerializer):
    to_user = serializers.ReadOnlyField(source="to_user.user_id")
    from_user = serializers.ReadOnlyField(source="from_user.user_id")

    class Meta:
        model = Follow
        fields = "__all__"
