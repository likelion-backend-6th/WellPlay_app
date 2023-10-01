from django.shortcuts import get_object_or_404, render
from rest_framework import viewsets, status
from .serializers import FeedSerializer
from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework.decorators import action
from drf_spectacular.utils import extend_schema

from .models import Comment, Feed


# Create your views here.
class FeedViewSet(viewsets.ModelViewSet):
    queryset = Feed.objects.all()
    serializer_class = FeedSerializer

    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)

    def retrieve(self, request, pk=None):
        pass

    def update(self, request, pk=None):
        pass

    @extend_schema(deprecated=True)
    def partial_update(self, request, pk=None):
        return Response(status=status.HTTP_400_BAD_REQUEST, data="Deprecated API")

    def destroy(self, request, pk=None):
        pass

    @action(detail=True, methods=["post"])
    def like(self, request, pk=None):
        pass


def check_permission(request, comment):
    if request.user != comment.owner:
        return Response({"detail": "권한이 없습니다."}, status=status.HTTP_403_FORBIDDEN)
    return None


class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer

    def create(self, request):
        # 댓글 생성시 사용자에게 알림 보내는 로직 추가 구현 예정
        serializer = CommentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(owner=request.user)  # 현재 사용자로 owner 설정
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, pk=None):
        comment = get_object_or_404(Comment, pk=pk)
        response = check_permission(request, comment)
        if response:  # 403Forbidden?
            return response

        serializer = CommentSerializer(instance=comment, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @extend_schema(deprecated=True)
    def partial_update(self, request, pk=None):
        return Response(status=status.HTTP_400_BAD_REQUEST, data="Deprecated API")

    def destroy(self, request, pk=None):
        comment = get_object_or_404(Comment, pk=pk)
        response = check_permission(request, comment)
        if response:  # 403Forbidden?
            return response

        comment.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
