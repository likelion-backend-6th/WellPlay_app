from django.contrib import admin
from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
)
from django.urls import include
from feed.views import CommentViewSet

from feed.urls import feed_router, comment_router


urlpatterns = [
    path("admin/", admin.site.urls),
    path("api-auth/", include("rest_framework.urls")),
    path("account/", include("account.urls")),
    path("feed/", include(feed_router.urls)),
    # comment get,post
    path(
        "feed/<int:id>/comments/",
        CommentViewSet.as_view({"get": "list", "post": "create"}),
        name="list-create-comments",
    ),
    # comment put, delete
    path(
        "feed/<int:id>/comments/<int:comment_id>/",
        CommentViewSet.as_view({"put": "update", "delete": "destroy"}),
        name="update-delete-comment",
    ),
    # jwt
    path("api/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("api/token/verify/", TokenVerifyView.as_view(), name="token_verify"),
    # drf-spectacular
    path("api/schema/", SpectacularAPIView.as_view(), name="api-schema"),
    path(
        "api/docs/",
        SpectacularSwaggerView.as_view(url_name="api-schema"),
        name="api-swagger-ui",
    ),
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
