from django.http import JsonResponse
from django.conf import settings


class HealthCheckMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if request.path == "/version/":
            return JsonResponse({"version": settings.VERSION})
        if request.path == "/health/":
            return JsonResponse({"status": "OK"})

        response = self.get_response(request)

        return response
