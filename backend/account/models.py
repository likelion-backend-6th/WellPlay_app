from django.db import models

# Create your models here.
class UserManager(BaseUserManager):
    def create_user(self, user_id, email, profile_name, password=None):
        if not user_id:
            raise ValueError('ID를 입력해야 합니다.')
        user = self.model(
            email=email,
            user_id=user_id,
            profile_name=profile_name,
        )
        user.set_password(password)
        user.save(using=self._db)
        return user

    # superuser는 프로필 이름이 필요 없을 것 같아서 제외
    def create_superuser(self, user_id, email, password=None):
        user = self.model(
            email=email,
            user_id=user_id,
        )
        user.set_password(password)
        user.is_admin = True
        user.save(using=self._db)
        return user



class User(AbstractBaseUser):
    user_id = models.CharField(max_length=20, null=False, unique=True)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=256)
    profile_name = models.CharField(max_length=20, null=True)
    profile_img = models.ImageField(null=True, blank=True)
    lol_userinfo = models.JSONField(null=True, blank=True)

    is_active = models.BooleanField(default=True)
    is_admin = models.BooleanField(default=False)

    USERNAME_FIELD = 'user_id'

    # 슈퍼유저 만들 때 입력받을 정보
    REQUIRED_FIELDS = ['email']

    objects = UserManager()

    def __str__(self):
        return f"{self.user_id} / {self.email} 의 계정"

    def has_perm(self, perm, obj=None):
        return True

    def has_module_perms(self, app_label):
        return True

    @property
    def is_staff(self):
        return self.is_admin
