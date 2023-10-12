from django.urls import path
from rest_framework.routers import DefaultRouter

from feed import views
from django.urls import include


app_name = "feed"

router = DefaultRouter()
router.register(r"", views.FeedViewSet, basename="")

urlpatterns = [
    path("", include(router.urls)),
    path("<int:pk>/like/", views.LikeView.as_view(), name="like"),
    path("userfeed/<str:user_id>/", views.FeedViewSet.as_view({"get": "user_feed"})),
    path(
        "<int:id>/comments/",
        views.CommentViewSet.as_view({"get": "list", "post": "create"}),
        name="list-create-comments",
    ),
    path(
        "<int:id>/comments/<int:comment_id>/",
        views.CommentViewSet.as_view({"put": "update", "delete": "destroy"}),
        name="update-delete-comment",
    ),
]
