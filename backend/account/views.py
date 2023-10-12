from django.contrib.auth import authenticate
from django.core.files import File
from django.conf import settings
from django.http import HttpRequest
from django.shortcuts import get_object_or_404
from drf_spectacular.utils import extend_schema
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import status, generics
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import views

from .serializers import *
from account.tasks import *  # Celery 작업 import
from common.uploader import FileUploader


class RegisterAPIView(APIView):
    @extend_schema(
        request=UserSerializer,
        responses=UserSerializer,
        summary="회원가입 - user_id, email, password 필드 필요",
    )
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


class UserQuitAPIView(APIView):
    @extend_schema(request=UserSerializer, responses=UserSerializer, summary="회원탈퇴")
    def delete(self, request):
        if request.user.is_authenticated:
            request.user.delete()
            response = Response(
                {"message": "user quit success"}, status=status.HTTP_202_ACCEPTED
            )
            response.delete_cookie("access")
            response.delete_cookie("refresh")
            return response


class LoginAPIView(APIView):
    @extend_schema(
        request=UserSerializer,
        responses=UserSerializer,
        summary="로그인 - email, password 필드 필요",
    )
    def post(self, request):
        obj = User.objects.filter(email=request.data.get("email")).exists()
        data = None
        if not obj:
            data = {"message": "email not exists"}

        user = authenticate(
            email=request.data.get("email"), password=request.data.get("password")
        )

        if user is not None:
            serializer = UserSerializer(user)
            token = TokenObtainPairSerializer.get_token(user)
            refresh_token = str(token)
            access_token = str(token.access_token)
            res = Response(
                {
                    "user": serializer.data,
                    "message": "login success",
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
        else:
            return Response(data=data, status=status.HTTP_400_BAD_REQUEST)


class LogoutAPIView(APIView):
    @extend_schema(request=UserSerializer, responses=UserSerializer, summary="로그아웃")
    def delete(self, request):
        # 쿠키에 저장된 토큰 삭제 => 로그아웃 처리
        response = Response(
            {"message": "Logout success"}, status=status.HTTP_202_ACCEPTED
        )
        response.delete_cookie("access")
        response.delete_cookie("refresh")
        return response


class ProfileAPIView(APIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = ProfileSerializer

    @extend_schema(request=None, responses=ProfileSerializer, summary="로그인한 유저 프로필 보기")
    def get(self, request, *args, **kwargs):
        profile = request.user.profile
        serializer = self.serializer_class(profile)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @extend_schema(
        request=ProfileSerializer, responses=ProfileSerializer, summary="로그인한 유저 프로필 수정"
    )
    def post(self, request, *args, **kwargs):
        image_url = None
        profile = request.user.profile
        serializer_data = request.data.copy()
        if image := request.data.get("image"):
            image: File
            uploader = FileUploader(
                settings.NCP_ACCESS_KEY, settings.NCP_SECRET_KEY, image
            )
            image_url = uploader.upload()

            # 이미지 URL을 프로필 데이터에 추가
            serializer_data["image_url"] = image_url

        serializer = self.serializer_class(profile, data=serializer_data, partial=True)

        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data, status=status.HTTP_200_OK)


class UserProfileAPIView(APIView):
    @extend_schema(request=None, responses=ProfileSerializer, summary="유저 프로필 보기")
    def get(self, request, user_id):
        user = User.objects.get(user_id=user_id)
        profile = user.profile
        serializer = ProfileSerializer(profile)
        return Response(serializer.data, status=status.HTTP_200_OK)


class FollowAPIView(generics.CreateAPIView):
    serializer_class = FollowSerializer
    queryset = Follow.objects.all()

    @extend_schema(request=FollowSerializer, responses=FollowSerializer)
    def post(self, request):
        serializer = FollowSerializer(data=request.data)
        if serializer.is_valid():
            to_user = serializer.validated_data["to_user"]
            qs = Follow.objects.filter(from_user=request.user, to_user=to_user)
            if qs.exists():
                qs.delete()
                return Response(
                    {"message": "Unfollow"}, status=status.HTTP_204_NO_CONTENT
                )
            else:
                Follow.objects.create(
                    from_user=request.user,
                    to_user=to_user,
                )
                return Response({"message": "Follow"}, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class FollowerList(generics.ListAPIView):
    serializer_class = FollowerListSerializer

    @extend_schema(request=FollowerListSerializer, responses=FollowerListSerializer, summary="로그인한 유저 팔로워 목록")
    def get(self, request):
        queryset = Follow.objects.filter(to_user=self.request.user)
        serializer = FollowerListSerializer(queryset, many=True)

        follower_count = queryset.count()
        response_data = {
            "follower_count": follower_count,
            "follower_list": serializer.data,
        }
        return Response(response_data)


class UserFollowerList(generics.ListAPIView):
    serializer_class = FollowerListSerializer

    @extend_schema(request=None, responses=FollowerListSerializer, summary="특정 유저 팔로워 목록")
    def get(self, request, user_id):
        user = User.objects.get(user_id=user_id)
        queryset = Follow.objects.filter(to_user=user)
        serializer = FollowerListSerializer(queryset, many=True)

        follower_count = queryset.count()
        response_data = {
            "follower_count": follower_count,
            "follower_list": serializer.data,
        }
        return Response(response_data)


class FollowingList(generics.ListAPIView):
    serializer_class = FollowingListSerializer

    @extend_schema(request=FollowingListSerializer, responses=FollowingListSerializer, summary="로그인한 유저 팔로잉 목록")
    def get(self, request):
        queryset = Follow.objects.filter(from_user=self.request.user)
        serializer = FollowerListSerializer(queryset, many=True)

        following_count = queryset.count()
        response_data = {
            "following_count": following_count,
            "following_list": serializer.data,
        }
        return Response(response_data)


class UserFollowingList(generics.ListAPIView):
    serializer_class = FollowingListSerializer

    @extend_schema(request=None, responses=FollowingListSerializer, summary="특정 유저 팔로잉 목록")
    def get(self, request, user_id):
        user = User.objects.get(user_id=user_id)
        queryset = Follow.objects.filter(from_user=user)
        serializer = FollowingListSerializer(queryset, many=True)

        following_count = queryset.count()
        response_data = {
            "following_count": following_count,
            "following_list": serializer.data,
        }
        return Response(response_data)


class LOLinfoAPIView(APIView):
    permission_classes = [
        IsAuthenticated,
    ]
    serializer_class = InfoLolSerializer

    @extend_schema(
        request=InfoLolSerializer, responses=InfoLolSerializer, summary="LOL 정보 업데이트"
    )
    def post(self, request, *args, **kwargs):
        infolol = request.user.infolol
        serializer_data = request.data.copy()

        serializer = self.serializer_class(infolol, data=serializer_data, partial=True)

        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(["POST"])
def riot_summoner_info(request):
    permission_classes = [
        IsAuthenticated,
    ]
    summoner_name = request.data.get("summoner_name")

    try:
        user_infolol = request.user.infolol  # 현재 로그인한 사용자의 Infolol
        print(user_infolol.id, "Celery tasks async start")  # 정수형 (장고유저ID)
        summoner_v4.delay(user_infolol.id, summoner_name)

        return Response({"message": "백그라운드 작업이 시작되었습니다."}, status=status.HTTP_200_OK)
    except Infolol.DoesNotExist:
        # Infolol 모델이 존재하지 않는 경우
        return Response(
            {"error": "Infolol 모델을 찾을 수 없습니다."}, status=status.HTTP_404_NOT_FOUND
        )


class InfololList(generics.ListAPIView):
    serializer_class = InfololSerializer
    queryset = Infolol.objects.all()  # 모든 Infolol 객체를 가져옴 (모든 사용자의 정보)

    def list(self, request, user_id=None):
        try:
            user_infolol = Infolol.objects.get(
                user__user_id=user_id
            )  # user_id에 해당하는 사용자의 Infolol 정보 가져오기
            serializer = InfololSerializer(user_infolol)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Infolol.DoesNotExist:
            return Response(
                {"error": "Infolol 모델을 찾을 수 없습니다."}, status=status.HTTP_404_NOT_FOUND
            )
