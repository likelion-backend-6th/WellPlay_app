from celery import shared_task
import requests
from .models import Infolol
import logging


@shared_task
def summoner_v4(user_infolol_id, summoner_name):
    logging.info("작업 시작 로그")
    try:
        logging.info("현재 로그인한 사용자의 Infolol 모델 가져오기")
        user_infolol = Infolol.objects.get(id=user_infolol_id)

        apiDefault = {
            "region": "https://kr.api.riotgames.com",
            "key": "RGAPI-66807ebb-30d8-49bf-9e1b-55e42b86a13c",
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
            return True
        else:
            logging.info(f"API 요청 실패. 상태 코드: {response.status_code}")
            return False

    except Infolol.DoesNotExist:
        logging.info("Infolol 모델이 존재하지 않습니다.")
        return False
