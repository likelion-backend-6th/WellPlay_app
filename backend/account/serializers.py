from rest_framework import serializers

from .models import Infoval, User, Profile, Follow, Infolol, Infofc


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


class InfoLolSerializer(serializers.ModelSerializer):
    class Meta:
        model = Infolol
        fields = "__all__"

    def update(self, instance, validated_data):
        for key, value in validated_data.items():
            setattr(instance, key, value)
        instance.save()

        return instance


class InfoValSerializer(serializers.ModelSerializer):
    class Meta:
        model = Infoval
        fields = "__all__"

    def update(self, instance, validated_data):
        for key, value in validated_data.items():
            setattr(instance, key, value)
        instance.save()

        return instance


class InfoFcSerializer(serializers.ModelSerializer):
    class Meta:
        model = Infofc
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
    to_user = serializers.CharField()

    class Meta:
        model = Follow
        fields = "__all__"
        read_only_fields = ("from_user",)


class FollowingListSerializer(serializers.ModelSerializer):
    from_user = serializers.ReadOnlyField(source="from_user.user_id")
    to_user = serializers.ReadOnlyField(source="to_user.user_id")
    profile_image = serializers.SerializerMethodField()

    class Meta:
        model = Follow
        fields = "__all__"

    def get_profile_image(self, obj) -> str:
        return obj.to_user.profile.image_url if obj.to_user else ""


class FollowerListSerializer(serializers.ModelSerializer):
    to_user = serializers.ReadOnlyField(source="to_user.user_id")
    from_user = serializers.ReadOnlyField(source="from_user.user_id")
    profile_image = serializers.SerializerMethodField()

    class Meta:
        model = Follow
        fields = "__all__"

    def get_profile_image(self, obj) -> str:
        return obj.from_user.profile.image_url if obj.from_user else ""


class InfololSerializer(serializers.ModelSerializer):
    class Meta:
        model = Infolol
        fields = "__all__"

    winrate = serializers.SerializerMethodField()
    tier = serializers.CharField(source="summoner_tier")
    rank = serializers.CharField(source="summoner_rank")
    summonerName = serializers.CharField(source="summoner_name")
    lp = serializers.IntegerField(source="summoner_lp")

    def get_winrate(self, obj) -> int:
        if obj.summoner_win is not None and obj.summoner_loss is not None:
            total_games = obj.summoner_win + obj.summoner_loss
            if total_games == 0:
                return 0  # 게임 횟수가 0인 경우 승률은 0%로 설정합니다.
            winrate = (obj.summoner_win / total_games) * 100
            return round(winrate, 2)  # 승률을 소수점 둘째 자리까지 반올림하여 반환합니다.
        else:
            return 0  # 승률을 계산할 수 없을 때 0%를 반환합니다.
