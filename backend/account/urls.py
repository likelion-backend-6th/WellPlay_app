from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from account.views import *


urlpatterns = [
    path("register/", RegisterAPIView.as_view()),
    path("login/", LoginAPIView.as_view()),
    path("logout/", LogoutAPIView.as_view()),
    path("refresh/", TokenRefreshView.as_view()),
    path("follow/<str:user_id>/", FollowAPIView.as_view()),
    path("follower/", FollowerList.as_view()),
    path("following/", FollowingList.as_view()),
    path("follower/<str:user_id>/", UserFollowerList.as_view()),
    path("following/<str:user_id>/", UserFollowingList.as_view()),
    path("profile/current/", ProfileAPIView.as_view()),
    path("profile/<str:user_id>/", UserProfileAPIView.as_view()),
    path("quit/", UserQuitAPIView.as_view()),
    path("riot_summoner_info/", riot_summoner_info),  # POST
    path("riot_summoner_info/<str:user_id>/", InfololList.as_view()),  # GET
    path("riot_val_info/", riot_val_info),  # POST
    path("riot_val_info/<str:user_id>/", InfovalList.as_view()),  # GET
    path("fc_name_info/", fc_name_info),  # POST
    path("activate/<str:uidb64>/<str:token>/", activate_account, name="activate"),
]
