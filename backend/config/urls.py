from django.contrib import admin
from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView
from django.urls import include
from feed.views import CommentViewSet

from feed.urls import feed_router, comment_router


urlpatterns = [
    path("admin/", admin.site.urls),
    path("api-auth", include("rest_framework.urls")),
    path("account/", include("account.urls")),
    path("feed/", include(feed_router.urls)),
    # 특정 피드의 댓글 목록을 가져오는 URL 패턴
    path(
        "feeds/<int:feed_id>/comments/",
        CommentViewSet.as_view({"get": "list"}),
        name="list-comments",
    ),
    # 댓글 생성을 위한 URL 패턴
    path(
        "feeds/<int:feed_id>/comments/",
        CommentViewSet.as_view({"post": "create"}),
        name="create-comment",
    ),
    # 댓글 수정, 삭제를 위한 URL 패턴
    path(
        "feeds/<int:feed_id>/comments/<int:pk>/",
        CommentViewSet.as_view({"put": "update", "delete": "destroy"}),
        name="update-delete-comment",
    ),
    # drf-spectacular
    path("api/schema/", SpectacularAPIView.as_view(), name="api-schema"),
    path(
        "api/docs/",
        SpectacularSwaggerView.as_view(url_name="api-schema"),
        name="api-swagger-ui",
    ),
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
