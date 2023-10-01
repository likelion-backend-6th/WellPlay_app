from django.http import HttpResponse
from django.shortcuts import render
from .tasks import update_lol_info


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
