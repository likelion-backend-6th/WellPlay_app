from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from .views import RegisterAPIView, FollowAPIView

urlpatterns = [
    path("register/", RegisterAPIView.as_view()),
    path("follow/", FollowAPIView.as_view()),
]
