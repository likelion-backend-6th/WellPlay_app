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
        cls.post_data = {
            "content": "test content",
            "owner": cls.authorized_user1,
        }

    # 피드 조회, 작성, 수정, 삭제
    def test_feed_crud(self):
        login_client = APIClient()
        login_client.force_authenticate(user=self.authorized_user1)
        # get
        res: Response = login_client.get("/feed/")
        self.assertEqual(res.status_code, status.HTTP_200_OK)

        # post
        res: Response = login_client.post("/feed/", self.post_data)
        feed_id = res.data["id"]
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)

        # put
        res: Response = login_client.put(
            f"/feed/{feed_id}/", {"content": "test content update"}
        )
        self.assertEqual(res.status_code, status.HTTP_200_OK)

        # another user put
        login_client.force_authenticate(user=self.authorized_user2)
        res: Response = login_client.put(
            f"/feed/{feed_id}/", {"content": "another user update"}
        )
        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)

        # another user delete
        res: Response = login_client.delete(f"/feed/{feed_id}/")
        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)

        # delete
        login_client.force_authenticate(user=self.authorized_user1)
        res: Response = login_client.delete(f"/feed/{feed_id}/")
        self.assertEqual(res.status_code, status.HTTP_204_NO_CONTENT)

    @patch("common.uploader.boto3.client")
    def test_post_with_or_without_image(self, s3_client: MagicMock):
        login_client = APIClient()
        login_client.force_authenticate(user=self.authorized_user1)
        # mock s3
        s3 = MagicMock()
        s3_client.return_value = s3
        s3.upload_fileobj.return_value = None
        s3.put_object_acl.return_value = None

        data = {
            "content": "test",
        }

        res: Response = login_client.post("/feed/", data)
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)

        with tempfile.NamedTemporaryFile(suffix=".jpg") as f:
            data["image"] = f
            res: HttpResponse = login_client.post("/feed/", data=data)
            self.assertEqual(res.status_code, status.HTTP_201_CREATED)

            res_data = json.loads(res.content)
            self.assertTrue(res_data["image_url"].startswith("https://"))

        s3.upload_fileobj.assert_called_once()
        s3.put_object_acl.assert_called_once()

    def test_comment_crud(self):
        login_client = APIClient()
        login_client.force_authenticate(user=self.authorized_user1)
        # post
        res: Response = login_client.post("/feed/", self.post_data)
        feed_id = res.data["id"]
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)

        # post comment
        res: Response = login_client.post(
            f"/feed/{feed_id}/comments/", {"content": "test comment"}
        )
        comment_id = res.data["id"]
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)

        # get
        res: Response = login_client.get(f"/feed/{feed_id}/comments/")
        self.assertEqual(res.status_code, status.HTTP_200_OK)

        # put comment
        res: Response = login_client.put(
            f"/feed/{feed_id}/comments/{comment_id}/",
            {"content": "test comment update"},
        )
        self.assertEqual(res.status_code, status.HTTP_200_OK)

        # another user put
        login_client.force_authenticate(user=self.authorized_user2)
        res: Response = login_client.put(
            f"/feed/{feed_id}/comments/{comment_id}/",
            {"content": "another user update"},
        )
        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)

        # another user delete
        res: Response = login_client.delete(f"/feed/{feed_id}/comments/{comment_id}/")
        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)

        # delete
        login_client.force_authenticate(user=self.authorized_user1)
        res: Response = login_client.delete(f"/feed/{feed_id}/comments/{comment_id}/")
        self.assertEqual(res.status_code, status.HTTP_204_NO_CONTENT)

    def test_like(self):
        login_client = APIClient()
        login_client.force_authenticate(user=self.authorized_user1)
        # write feed
        res: Response = login_client.post("/feed/", self.post_data)
        feed_id = res.data["id"]
        user_id = self.authorized_user1.id

        like_data = {
            "user": user_id,
            "feed": feed_id,
        }

        # like
        res: Response = login_client.post(f"/feed/{feed_id}/like/", like_data)
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)

        # unlike
        res: Response = login_client.post(f"/feed/{feed_id}/like/", like_data)
        self.assertEqual(res.status_code, status.HTTP_204_NO_CONTENT)
