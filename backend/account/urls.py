from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from account.views import RegisterAPIView, profile, login, follow

urlpatterns = [
    path("register/", RegisterAPIView.as_view()),
    path("account/profile", profile, name='profile'),
    path("account/login", login, name='login'),
    path("<str:user_id>/follow/", follow, name='follow'),
]
