# 라이엇 API 호출 및 사용자 계정 인증 작업

from celery import Task
from celery import shared_task
import requests
from .models import Profile


@shared_task
def update_lol_info(profile_id):
    try:
        user_profile = Profile.objects.get(id=profile_id)

        # 라이엇 API에 요청을 보내서 lol_info 필드를 업데이트합니다.
        # 아래 URL과 인증 토큰은 실제 라이엇 API 엔드포인트 및 토큰으로 대체해야 합니다.
        api_url = "https://api.riotgames.com/lol/your-endpoint"
        api_key = "your-api-key"  # 실제 라이엇 API 키로 대체
        headers = {"X-Riot-Token": api_key}
        response = requests.get(api_url, headers=headers)

        if response.status_code == 200:
            # 데이터 업데이트
            user_profile.lol_info = response.json()
            user_profile.save()
            return "Success: LOL info updated."
        else:
            return f"Error: Failed to fetch data from Riot API (Status Code: {response.status_code})."

    except Profile.DoesNotExist:
        return "Error: Profile not found."

    except Exception as e:
        return f"Error: {str(e)}"
