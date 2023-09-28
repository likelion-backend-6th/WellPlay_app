from django.shortcuts import render
from rest_framework import viewsets, status
from .serializers import FeedSerializer
from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework.decorators import action
from drf_spectacular.utils import extend_schema

from .models import Feed


# Create your views here.
class FeedViewset(viewsets.ModelViewSet):
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


class CommentViewset(viewsets.ModelViewSet):
    pass
