import jwt
from django.urls import path, include
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.views import APIView
from .serializers import *
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import status, viewsets, routers
from rest_framework.response import Response

#celery viewset
from django.http import HttpResponse
from django.shortcuts import render
from .tasks import update_lol_info


class RegisterAPIView(APIView):
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()

            token = TokenObtainPairSerializer.get_token(user)
            refresh_token = str(token)
            access_token = str(token.access_token)
            res = Response(
                {
                    "user": serializer.data,
                    "message": "register successs",
                    "token": {
                        "access": access_token,
                        "refresh": refresh_token,
                    },
                },
                status=status.HTTP_200_OK,
            )

            res.set_cookie("access", access_token, httponly=True)
            res.set_cookie("refresh", refresh_token, httponly=True)

            return res
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


def update_lol_info_view(request):
    if request.user.is_authenticated:  # 로그인한 사용자인가?
        profile_id = request.user.profile.id  # 현재 로그인한 사용자의 프로필에 엑세스

        result = update_lol_info.apply_async(
            args=[profile_id],
        )  # 작업을 비동기적으로 실행(worker)
        if result.successful():
            return HttpResponse("라이엇 정보 업데이트 작업이 예약되었습니다.")
        else:
            return HttpResponse("라이엇 정보 업데이트 작업 예약 중 오류가 발생했습니다.")

    else:
        return HttpResponse("로그인이 필요합니다.")


class FollowAPIView(APIView):
    def post(self, request, format=None):
        serializer = FollowSerializer(data=request.data)
        if serializer.is_valid():
            to_user = serializer.validated_data["to_user"]
            qs = Follow.objects.filter(from_user=request.user, to_user=to_user)
            if qs.exists():
                qs.delete()
                return Response({"message": "Unfollow"}, status=status.HTTP_204_NO_CONTENT)
            else:
                Follow.objects.create(from_user=request.user,
                                      to_user=to_user,)
                return Response({"message": "Follow"}, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
