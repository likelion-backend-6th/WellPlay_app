from django.shortcuts import render
from rest_framework import viewsets, status
from .serializers import FeedSerializer, CommentSerializer
from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework.decorators import action
from drf_spectacular.utils import extend_schema

from .models import Feed


# Create your views here.
class FeedViewset(viewsets.ModelViewSet):
    queryset = Feed.objects.all()
    serializer_class = FeedSerializer

    def list(self, request):
        pass

    def create(self, request):
        pass

    def retrieve(self, request, pk=None):
        pass

    def update(self, request, pk=None):
        pass

    @extend_schema(deprecated=True)
    def partial_update(self, request, pk=None):
        return Response(status=status.HTTP_400_BAD_REQUEST, data="Deprecated API")

    def destroy(self, request, pk=None):
        pass


class CommentViewSet(viewsets.ModelViewSet):
    queryset = Feed.objects.all()
    serializer_class = CommentSerializer

    # 댓글 불러오기
    @action(detail=True, methods=["get"])
    def comments(self, request, pk=None):
        pass

    # 댓글 입력, 수정, 삭제
    @action(detail=True, methods=["post"])
    def comment(self, request, pk=None):
        pass

    # 댓글 수정
    @action(detail=True, methods=["put"])
    def comment(self, request, pk=None):
        pass

    # 댓글 삭제
    @action(detail=True, methods=["delete"])
    def comment(self, request, pk=None):
        pass

    @action(detail=True, methods=["post"])
    def like(self, request, pk=None):
        pass
