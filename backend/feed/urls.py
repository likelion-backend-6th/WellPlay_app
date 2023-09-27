from django.urls import path
from rest_framework.routers import DefaultRouter

from feed import views


feed_router = DefaultRouter()
feed_router.register("", views.FeedViewset, basename="feed")

comment_router = DefaultRouter()
comment_router.register("", views.CommentViewset, basename="comment")
