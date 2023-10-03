from django.urls import path
from rest_framework.routers import DefaultRouter

from feed import views
from django.urls import include


app_name = "feed"

router = DefaultRouter()
router.register(r"", views.FeedViewSet, basename="")

urlpatterns = [
    path("<int:pk>/like/", views.LikeView.as_view(), name="like"),
    path("", include(router.urls)),
]
