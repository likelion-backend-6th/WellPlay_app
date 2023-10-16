from rest_framework.test import APITestCase
from rest_framework.test import APIClient
from rest_framework.response import Response
from rest_framework.request import Request
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
        cls.unauthorized_user = cls.test_model.objects.create_user(
            email="unauth@admin.com", user_id="unauth", password="1234"
        )
        cls.post_data = {
            "content": "test content",
            "owner": cls.authorized_user1,
        }

    # 피드 수정, 삭제
    def test_feed_update_delete(self):
        client = APIClient()
        client.force_authenticate(user=self.authorized_user1)
        res: Response = client.post("/feed/", self.post_data)
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
