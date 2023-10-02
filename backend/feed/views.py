import uuid

import boto3
from django.core.files.base import File
from django.db.models import Q
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework.decorators import action
from drf_spectacular.utils import extend_schema
from django.conf import settings

from .models import Feed, Like
from .serializers import FeedSerializer, FeedUploadSerializer, LikeSerializer


# Create your views here.
class FeedViewset(viewsets.ModelViewSet):
    queryset = Feed.objects.all()
    serializer_class = FeedSerializer

    def get_serializer_class(self):
        if self.action == "create":
            return FeedUploadSerializer
        return super().get_serializer_class()

    def list(self, request, *args, **kwargs):
        feeds = Feed.objects.order_by("-created_at")
        serializer = FeedSerializer(feeds, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=False, methods=["get"])
    def recommend(self, request, *args, **kwargs):
        feeds = Feed.objects.filter(Like__isnull=False).order_by("-like__count")
        serializer = FeedSerializer(feeds, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def create(self, request: Request, *args, **kwargs):
        image_url = None
        video_url = None
        # if image exist
        if image := request.data.get("image"):
            image: File
            service_name = "s3"
            endpoint_url = "https://kr.object.ncloudstorage.com"
            access_key = settings.NCP_ACCESS_KEY
            secret_key = settings.NCP_SECRET_KEY
            bucket_name = "wellplay"

            s3 = boto3.client(
                service_name,
                endpoint_url=endpoint_url,
                aws_access_key_id=access_key,
                aws_secret_access_key=secret_key,
            )

            # s3 upload
            image_id = str(uuid.uuid4())
            ext = image.name.split(".")[-1]
            image_filename = f"{image_id}.{ext}"
            s3.upload_fileobj(image.file, bucket_name, image_filename)

            # get image url
            s3.put_object_acl(ACL="public-read", Bucket=bucket_name, Key=image_filename)
            image_url = f"{endpoint_url}/{bucket_name}/{image_filename}"

        if video := request.data.get("video"):
            video: File
            service_name = "s3"
            endpoint_url = "https://kr.object.ncloudstorage.com"
            access_key = settings.NCP_ACCESS_KEY
            secret_key = settings.NCP_SECRET_KEY
            bucket_name = "wellplay"

            s3 = boto3.client(
                service_name,
                endpoint_url=endpoint_url,
                aws_access_key_id=access_key,
                aws_secret_access_key=secret_key,
            )

            video_id = str(uuid.uuid4())
            ext = video.name.split(".")[-1]
            video_filename = f"{video_id}.{ext}"
            s3.upload_fileobj(video.file, bucket_name, video_filename)

            s3.put_object_acl(ACL="public-read", Bucket=bucket_name, Key=video_filename)
            video_url = f"{endpoint_url}/{bucket_name}/{video_filename}"

        serializer = FeedSerializer(data=request.data)
        if serializer.is_valid():
            data = serializer.validated_data
            data["owner"] = request.user
            data["image_url"] = image_url if image_url else None
            data["video_url"] = video_url if video_url else None
            res: Feed = Feed.objects.create(**data)
            return Response(
                status=status.HTTP_201_CREATED, data=FeedSerializer(res).data
            )
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST, data=serializer.errors)

    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)

    def update(self, request: Request, *args, **kwargs):
        user = request.user
        feed: Feed = self.get_object()
        if not feed.access_by_feed(user):
            return Response(
                status=status.HTTP_403_FORBIDDEN, data="You do not have permission"
            )
        return super().update(request, *args, **kwargs)

    @extend_schema(deprecated=True)
    def partial_update(self, request, pk=None):
        return Response(status=status.HTTP_400_BAD_REQUEST, data="Deprecated API")

    def destroy(self, request: Request, *args, **kwargs):
        user = request.user
        feed: Feed = self.get_object()
        if not feed.access_by_feed(user):
            return Response(
                status=status.HTTP_403_FORBIDDEN, data="You do not have permission"
            )
        return super().destroy(request, *args, **kwargs)

    @action(detail=True, methods=["post"])
    def like(self, request: Request, pk=None):
        serializer = LikeSerializer(data=request.data)
        if serializer.is_valid():
            feed = serializer.validated_data["feed"]
            qs = Like.objects.filter(feed=feed, user=request.user)
            if qs.exists():
                qs.delete()
                return Response(status=status.HTTP_204_NO_CONTENT)
            else:
                Like.objects.create(feed=feed, user=request.user)
                return Response(status=status.HTTP_201_CREATED)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST, data=serializer.errors)


class CommentViewset(viewsets.ModelViewSet):
    pass
