from django.urls import path
from rest_framework.routers import DefaultRouter

from feed import views


router = DefaultRouter()
router.register("", views.FeedViewset, basename="feed")
