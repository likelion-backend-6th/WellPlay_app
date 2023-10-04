from rest_framework import serializers

from .models import User, Profile, Follow


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['user_id', 'email', 'password']
        # read_only_field = ('last_login', 'is_superuser', ' is_active', 'is_staff', 'groups', 'user_permissions')

    def create(self, validated_data):
        user = User.objects.create_user(
            user_id=validated_data['user_id'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = '__all__'

    def update(self, instance, validated_data):
        pass


class FollowSerializer(serializers.ModelSerializer):
    class Meta:
        model = Follow
        fields = '__all__'
        read_only_fields = ("from_user",)
