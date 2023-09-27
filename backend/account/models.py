from django.contrib.auth.base_user import BaseUserManager
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
    def create_superuser(self, user_id, email,  password=None):
        user = self.model(
            email=email,
            user_id=user_id,
            password=password,
        )
        user.is_admin = True
        user.save(using=self._db)
        return user
