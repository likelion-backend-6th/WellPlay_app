from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth.models import (
    AbstractBaseUser,
    BaseUserManager,
    PermissionsMixin,
)
from django_prometheus.models import ExportModelOperationsMixin

from common.models import CommonModel


# Helper Class
class UserManager(BaseUserManager):
    def create_user(self, user_id, email, password, **kwargs):
        if not user_id:
            raise ValueError("Please enter your user_id")
        if not email:
            raise ValueError("Please enter your email")
        if not password:
            raise ValueError("Please enter your password")
        user = self.model(
            user_id=user_id,
            email=email,
        )
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, user_id, email, password):
        superuser = self.create_user(
            user_id=user_id,
            email=email,
            password=password,
        )

        superuser.is_staff = True
        superuser.is_superuser = True
        superuser.is_active = True

        superuser.save(using=self._db)
        return superuser


# AbstractBaseUser를 상속해서 유저 커스텀
class User(
    ExportModelOperationsMixin("user"), CommonModel, AbstractBaseUser, PermissionsMixin
):
    user_id = models.CharField(max_length=30, unique=True, null=False, blank=False)
    email = models.EmailField(max_length=30, unique=True, null=False, blank=False)
    is_superuser = models.BooleanField(default=False)
    is_active = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)

    objects = UserManager()
    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = [
        "user_id",
    ]

    def __str__(self):
        return self.user_id


class Infolol(ExportModelOperationsMixin("infolol"), models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="infolol")
    summoner_name = models.CharField(max_length=30, null=True, blank=True)
    summoner_id = models.CharField(max_length=128, null=True, blank=True)
    summoner_puuid = models.CharField(max_length=128, null=True, blank=True)
    summoner_tier = models.CharField(max_length=128, null=True, blank=True)
    summoner_rank = models.CharField(max_length=128, null=True, blank=True)
    summoner_lp = models.IntegerField(null=True, blank=True)
    summoner_win = models.IntegerField(null=True, blank=True)
    summoner_loss = models.IntegerField(null=True, blank=True)

    def __str__(self):
        return f"{self.summoner_name}'s LoL Info"


class Infoval(ExportModelOperationsMixin("infoval"), models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="infoval")
    val_name = models.CharField(max_length=30, null=True, blank=True)
    val_tag = models.CharField(max_length=10, null=True, blank=True)
    val_puuid = models.CharField(max_length=128, null=True, blank=True)

    def __str__(self):
        return f"{self.val_name}'s Val Info"


class Infofc(ExportModelOperationsMixin("infofc"), models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="infofc")
    fc_name = models.CharField(max_length=30, null=True, blank=True)
    fc_id = models.CharField(max_length=128, null=True, blank=True)
    fc_level = models.IntegerField(null=True, blank=True)
    fc_division = models.IntegerField(null=True, blank=True)

    def __str__(self):
        return f"{self.fc_name}'s FC Info"


# Profile 모델로 분리
class Profile(ExportModelOperationsMixin("profile"), CommonModel):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    nickname = models.CharField(max_length=30, null=True, blank=True)
    image_url = models.URLField(default="https://kr.object.ncloudstorage.com/wellplay/welsh.png", blank=True)

    def __str__(self):
        return f"{self.user.user_id} Profile"


@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance, nickname=instance.user_id)


@receiver(post_save, sender=User)
def create_user_lolinfo(sender, instance, created, **kwargs):
    if created:
        Infolol.objects.create(user=instance)


# follow
class Follow(ExportModelOperationsMixin("follow"), CommonModel):
    from_user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="from_user"
    )
    to_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="to_user")

    def __str__(self):
        return f"{self.from_user} Follow {self.to_user}"
