from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from account.views import *


urlpatterns = [
    path("register/", RegisterAPIView.as_view()),
    path("login/", LoginAPIView.as_view()),
    path("logout/", LogoutAPIView.as_view()),
    path("refresh/", TokenRefreshView.as_view()),
    path("follow/", FollowAPIView.as_view()),
    path("following/", FollowingList.as_view()),
    path("follower/", FollowerList.as_view()),
    path("profile/current/", ProfileAPIView.as_view()),
    path("profile/<str:user_id>/", UserProfileAPIView.as_view()),
    path("quit/", UserQuitAPIView.as_view()),
    path("LOLinfo/", LOLinfoAPIView.as_view()),
    path("start-background-job/", start_background_job),
    path("test", Test.as_view()),
]
