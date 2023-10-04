from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from account.views import RegisterAPIView, LoginAPIView, LogoutAPIView, FollowAPIView

urlpatterns = [
    path("register/", RegisterAPIView.as_view()),
    path("login/", LoginAPIView.as_view()),
    path("logout/", LogoutAPIView.as_view()),
    path("refresh/", TokenRefreshView.as_view()),
    path("follow/", FollowAPIView.as_view())
]
