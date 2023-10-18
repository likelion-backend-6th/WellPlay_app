import json
import tempfile
from unittest.mock import patch, MagicMock

from rest_framework.test import APITestCase, APIClient
from rest_framework.response import Response
from rest_framework import status
from django.http import HttpResponse
from django.contrib.auth import get_user_model


class FeedTest(APITestCase):
    @classmethod
    def setUpTestData(cls) -> None:
        cls.test_model = get_user_model()
        cls.superuser = cls.test_model.objects.create_superuser(
            email="admin@admin.com", user_id="admin", password="1234"
        )
        cls.authorized_user1 = cls.test_model.objects.create_user(
            email="auth1@admin.com", user_id="auth1", password="1234"
        )
        cls.authorized_user2 = cls.test_model.objects.create_user(
            email="auth2@admin.com", user_id="auth2", password="1234"
        )
        cls.vaild_user_data = {
            "email": "test@test.com",
            "user_id": "test",
            "password": "1234qwer!@#$",
        }
        cls.unvaild_user_data = {
            "email": "test.test",
            "user_id": "test",
            "password": "1234",
        }
        cls.login_user_data = {
            "email": "test@test.com",
            "password": "1234qwer!@#$",
        }

    # register
    def test_register(self):
        client = APIClient()

        # vaild
        res: Response = client.post("/account/register/", data=self.vaild_user_data)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(
            self.test_model.objects.get(user_id="test").email, "test@test.com"
        )

        # unvaild
        res: Response = client.post("/account/register/", data=self.unvaild_user_data)
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

        # 메일 미인증 로그인
        res: Response = client.post("/account/login/", data=self.login_user_data)
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

        # 로그아웃
        client.force_authenticate(user=self.authorized_user1)
        res: Response = client.delete("/account/logout/")
        self.assertEqual(res.status_code, status.HTTP_202_ACCEPTED)

    # profile
    def test_profile(self):
        client = APIClient()
        client.force_authenticate(user=self.authorized_user1)

        # profile get
        res: Response = client.get(f"/account/profile/current/")
        self.assertEqual(res.status_code, status.HTTP_200_OK)

        # profile patch
        res: Response = client.post(
            f"/account/profile/current/", data={"nickname": "test"}
        )
        self.assertEqual(res.status_code, status.HTTP_200_OK)

        # another user profile get
        res: Response = client.get("/account/profile/auth2/")
        self.assertEqual(res.status_code, status.HTTP_200_OK)

    # follow
    def test_follow(self):
        client = APIClient()
        client.force_authenticate(user=self.authorized_user1)

        follow_data = {
            "to_user": self.authorized_user2,
        }
        url = f"/account/follow/{self.authorized_user1}/"

        # follow
        res: Response = client.post(url, data=follow_data)
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)

        # # unfollow
        # res: Response = client.post(url, data=follow_data)
        # self.assertEqual(res.status_code, status.HTTP_204_NO_CONTENT)
