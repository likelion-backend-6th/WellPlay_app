from django.contrib.auth import authenticate
from django.core.files import File
from django.conf import settings
from django.http import HttpResponse
from drf_spectacular.utils import extend_schema
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import status, generics
from rest_framework.response import Response
from rest_framework.decorators import api_view
from celery.result import AsyncResult
from django.contrib.auth import get_user_model
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.contrib.auth.tokens import PasswordResetTokenGenerator

from .serializers import *
from account.tasks import *
from common.uploader import FileUploader


User = get_user_model()
account_activation_token = PasswordResetTokenGenerator()


class AccountActivationTokenGenerator(PasswordResetTokenGenerator):
    def _make_hash_value(self, user, timestamp):
        return str(user.pk) + str(timestamp) + str(user.is_active)


account_activation_token = AccountActivationTokenGenerator()


def send_activation_email(user, request):
    current_site = request.get_host()
    subject = "활성화 링크를 확인해주세요."

    html_message = render_to_string(
        "activation_email.html",
        {
            "user": user,
            "current_site": current_site,
            "uidb64": user.pk,
            "token": account_activation_token.make_token(user),
        },
    )
    text_message = strip_tags(html_message)

    # EmailMultiAlternatives를 사용하여 메일 보내기
    email = EmailMultiAlternatives(
        subject, text_message, settings.EMAIL_HOST_USER, [user.email]
    )
    email.attach_alternative(html_message, "text/html")
    email.send()


@api_view(["GET"])
def activate_account(request, uidb64, token):
    try:
        uid = uidb64
        user = User.objects.get(pk=uid)

        if user is not None and account_activation_token.check_token(user, token):
            user.is_active = True
            user.save()
            return HttpResponse(
                """
                <script>
                    alert("Wall Play! 인증에 성공했습니다. 사이트로 돌아가 로그인 해주세요");
                    window.close();
                </script>
            """
            )
        else:
            return Response(
                {"message": "활성화 링크가 유효하지 않습니다."}, status=status.HTTP_400_BAD_REQUEST
            )
    except (
        TypeError,
        ValueError,
        OverflowError,
        User.DoesNotExist,
        UnicodeDecodeError,
    ) as e:
        # 예외 처리 추가
        return Response({"message": str(e)}, status=status.HTTP_400_BAD_REQUEST)


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
            user.is_active = False  # 사용자를 비활성화로 설정
            infofc_instance = Infofc.objects.create(
                user=user, fc_name="default_fc_name"
            )
            infofc_instance.save()
            user.save()
            send_activation_email(user, request)  # 이메일 전송

            return Response(
                {"message": "회원가입이 성공적으로 이루어졌습니다. 이메일을 확인하여 계정을 활성화하세요."},
                status=status.HTTP_200_OK,
            )
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
    def post(self, request, user_id):
        user = User.objects.get(user_id=user_id)
        serializer = FollowSerializer(data=request.data)
        print(request.user, user)
        if serializer.is_valid():
            to_user_username = serializer.validated_data["to_user"]
            to_user = User.objects.get(user_id=to_user_username)
            qs = Follow.objects.filter(from_user=request.user, to_user=user)
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

    @extend_schema(
        request=FollowerListSerializer,
        responses=FollowerListSerializer,
        summary="로그인한 유저 팔로워 목록",
    )
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

    @extend_schema(
        request=None, responses=FollowerListSerializer, summary="특정 유저 팔로워 목록"
    )
    def get(self, request, user_id):
        user = User.objects.get(user_id=user_id)
        queryset = Follow.objects.filter(to_user=user)
        serializer = FollowerListSerializer(queryset, many=True)

        follower_count = queryset.count()
        follower_users = [follow.from_user.user_id for follow in queryset]
        response_data = {
            "follower_count": follower_count,
            "follower_users": follower_users,
            "follower_list": serializer.data,
        }
        return Response(response_data)


class FollowingList(generics.ListAPIView):
    serializer_class = FollowingListSerializer

    @extend_schema(
        request=FollowingListSerializer,
        responses=FollowingListSerializer,
        summary="로그인한 유저 팔로잉 목록",
    )
    def get(self, request):
        queryset = Follow.objects.filter(from_user=self.request.user)
        serializer = FollowingListSerializer(queryset, many=True)

        following_count = queryset.count()
        response_data = {
            "following_count": following_count,
            "following_list": serializer.data,
        }
        return Response(response_data)


class UserFollowingList(generics.ListAPIView):
    serializer_class = FollowingListSerializer

    @extend_schema(
        request=None, responses=FollowingListSerializer, summary="특정 유저 팔로잉 목록"
    )
    def get(self, request, user_id):
        user = User.objects.get(user_id=user_id)
        queryset = Follow.objects.filter(from_user=user)
        serializer = FollowingListSerializer(queryset, many=True)

        following_count = queryset.count()
        following_users = [follow.to_user.user_id for follow in queryset]
        response_data = {
            "following_count": following_count,
            "following_users": following_users,
            "following_list": serializer.data,
        }
        return Response(response_data)


@api_view(["POST"])
def riot_summoner_info(request):
    permission_classes = [
        IsAuthenticated,
    ]
    summoner_name = request.data.get("summoner_name")

    try:
        user_infolol = request.user.infolol  # 현재 로그인한 사용자의 Infolol
        print(user_infolol.id, "Celery tasks async start")  # 정수형 (장고유저ID)
        result = summoner_v4.delay(user_infolol.id, summoner_name)
        try:
            task_result = result.get(timeout=10)  # 10초 동안 대기
            if task_result:  # 작업이 성공한 경우
                return Response(True, status=status.HTTP_200_OK)
            else:  # 작업이 실패한 경우
                return Response(False, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except TimeoutError:
            return Response(False, status=status.HTTP_408_REQUEST_TIMEOUT)
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
            user_infolol = Infolol.objects.get(user__user_id=user_id)
            serializer = InfololSerializer(user_infolol)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Infolol.DoesNotExist:
            return Response(
                {"error": "Infolol 모델을 찾을 수 없습니다."}, status=status.HTTP_404_NOT_FOUND
            )


class InfovalList(generics.ListAPIView):
    serializer_class = InfoValSerializer
    queryset = Infoval.objects.all()

    def list(self, request, user_id=None):
        try:
            user_infoval = Infoval.objects.get(user__user_id=user_id)
            serializer = InfoValSerializer(user_infoval)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Infoval.DoesNotExist:
            return Response(
                {"error": "Infoval 모델을 찾을 수 없습니다."}, status=status.HTTP_404_NOT_FOUND
            )


class InfofcList(generics.ListAPIView):
    serializer_class = InfoFcSerializer
    queryset = Infofc.objects.all()

    def list(self, request, user_id=None):
        try:
            user_infofc = Infofc.objects.get(user__user_id=user_id)
            serializer = InfoFcSerializer(user_infofc)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Infofc.DoesNotExist:
            return Response(
                {"error": "Infofc 모델을 찾을 수 없습니다."}, status=status.HTTP_404_NOT_FOUND
            )


@api_view(["POST"])
def riot_val_info(request):
    permission_classes = [
        IsAuthenticated,
    ]
    val_name = request.data.get("val_name")
    val_tag = request.data.get("val_tag")

    try:
        user = request.user
        infoval, created = Infoval.objects.get_or_create(
            user=user, defaults={"val_name": val_name, "val_tag": val_tag}
        )

        print(infoval.id, "Celery tasks async start")  # 정수형 (장고유저ID)
        result = account_v1.delay(infoval.id, val_name, val_tag)
        try:
            task_result = result.get(timeout=10)  # 10초 동안 대기
            if task_result:  # 작업이 성공한 경우
                return Response(True, status=status.HTTP_200_OK)
            else:  # 작업이 실패한 경우
                return Response(False, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except TimeoutError:
            return Response(False, status=status.HTTP_408_REQUEST_TIMEOUT)
    except Infoval.DoesNotExist:
        # Infoval 모델이 존재하지 않는 경우
        return Response(
            {"error": "Infoval 모델을 찾을 수 없습니다."}, status=status.HTTP_404_NOT_FOUND
        )


@api_view(["POST"])
def fc_name_info(request):
    permission_classes = [
        IsAuthenticated,
    ]
    fc_name = request.data.get("fc_name")

    try:
        user = request.user
        if hasattr(user, "infofc"):
            user_infofc = user.infofc  # 현재 로그인한 사용자의 Infofc
            print(user_infofc.id, "Celery tasks async start")  # 정수형 (장고 유저 ID)
            result = fc_username.delay(user_infofc.id, fc_name)
            try:
                task_result = result.get(timeout=10)  # 10초 동안 대기
                if task_result:  # 작업이 성공한 경우
                    return Response(True, status=status.HTTP_200_OK)
                else:  # 작업이 실패한 경우
                    return Response(False, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            except TimeoutError:
                return Response(False, status=status.HTTP_408_REQUEST_TIMEOUT)
        else:
            # Infofc 모델이 존재하지 않는 경우
            # 여기서 새로운 Infofc 인스턴스를 생성하여 User 인스턴스와 연결할 수 있습니다.
            infofc_instance = Infofc.objects.create(
                user=user, fc_name="default_fc_name"
            )
            infofc_instance.save()
            return Response(
                {"message": "Infofc 인스턴스가 생성되었습니다."}, status=status.HTTP_201_CREATED
            )
    except Infofc.DoesNotExist:
        return Response({"error": "Infofc 문제."}, status=status.HTTP_404_NOT_FOUND)
