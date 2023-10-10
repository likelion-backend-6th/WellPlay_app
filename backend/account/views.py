import requests
from django.http import HttpResponse, JsonResponse
from django.contrib.auth import authenticate
from django.core.files import File
from django.conf import settings
from drf_spectacular.utils import extend_schema
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import status, generics
from rest_framework.response import Response
from rest_framework.authentication import TokenAuthentication

from .serializers import *
from .tasks import *  # Celery 작업 import
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

    @extend_schema(request=FollowerListSerializer, responses=FollowerListSerializer)
    def get(self, request):
        queryset = Follow.objects.filter(to_user=self.request.user)
        serializer = FollowerListSerializer(queryset, many=True)

        follower_count = queryset.count()
        response_data = {
            "follower_count": follower_count,
            "follower_list": serializer.data,
        }
        return Response(response_data)


class FollowingList(generics.ListAPIView):
    serializer_class = FollowingListSerializer

    @extend_schema(request=FollowingListSerializer, responses=FollowingListSerializer)
    def get(self, request):
        queryset = Follow.objects.filter(from_user=self.request.user)
        serializer = FollowerListSerializer(queryset, many=True)

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


class RiotApiIntegrationView(APIView):
    def post(self, request):
        # 클라이언트에서 보낸 username_lol 값을 가져옵니다.
        username_lol = request.data.get("username_lol")

        # 라이엇 API에 요청을 보내기 위한 설정
        api_key = "YOUR_RIOT_API_KEY"  # 라이엇 API 키를 입력하세요
        base_url = "https://kr.api.riotgames.com/lol/summoner/v4/summoners/by-name/"

        # 라이엇 API에 요청을 보냅니다.
        response = requests.get(
            f"{base_url}{username_lol}", headers={"X-Riot-Token": api_key}
        )

        # API 응답을 확인하고 처리합니다.
        if response.status_code == 200:
            data = response.json()

            # 응답을 InfoLol 모델에 데이터를 저장
            info_lol, created = Infolol.objects.get_or_create(
                profile=request.user.profile, defaults={"json_lol": data}
            )

            # 백그라운드 작업을 비동기적으로 실행
            process_lol_data.delay(info_lol.id, data)

            # 응답을 클라이언트에게 반환합니다.
            return Response(data, status=status.HTTP_200_OK)
        else:
            # API 응답이 실패한 경우, 에러 메시지를 반환합니다.
            return Response(
                {"error": "API 요청이 실패했습니다."}, status=status.HTTP_400_BAD_REQUEST
            )
