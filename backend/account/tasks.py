from celery import shared_task
import requests
from .models import Infolol
import logging

from typing import List


@shared_task
def test_task(a: int, b: int):
    print("test Celery task : ", a + b)
    return a + b


@shared_task
def process_lol_data(user_infolol_id, summoner_name):
    logging.info("작업 시작 로그")
    try:
        logging.info("현재 로그인한 사용자의 Infolol 모델 가져오기")
        user_infolol = Infolol.objects.get(id=user_infolol_id)

        apiDefault = {
            "region": "https://kr.api.riotgames.com",  # 한국서버를 대상으로 호출
            "key": "RGAPI-c313a68f-4e62-45ce-9922-e6eca6ad9118",  # API KEY
            "summonerName": summoner_name,
        }
        url = f"{apiDefault['region']}/lol/summoner/v4/summoners/by-name/{apiDefault['summonerName']}?api_key={apiDefault['key']}"
        response = requests.get(url)
        logging.info("요청이 성공했는지 보러가기")
        if response.status_code == 200:
            data = response.json()
            user_infolol.summoner_json = data
            user_infolol.save()

            logging.info(f"JSON 데이터 저장 완료: {data}")

            # 작업이 성공적으로 완료되었으므로 True 반환
            return True
        else:
            logging.info(f"API 요청 실패. 상태 코드: {response.status_code}")

            # 작업이 실패했으므로 False 반환
            return False

    except Infolol.DoesNotExist:
        logging.info("Infolol 모델이 존재하지 않습니다.")

        # 작업이 실패했으므로 False 반환
        return False
