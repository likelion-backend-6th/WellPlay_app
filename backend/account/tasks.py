from django.conf import settings
from celery import shared_task
import requests
from .models import Infolol, Infoval
import logging


@shared_task
def summoner_v4(user_infolol_id, summoner_name):
    logging.info("start summoner_v4")
    try:
        user_infolol = Infolol.objects.get(id=user_infolol_id)

        apiDefault = {
            "region": "https://kr.api.riotgames.com",
            "key": settings.RIOT_API_KEY,
            "summonerName": summoner_name,
        }
        url = f"{apiDefault['region']}/lol/summoner/v4/summoners/by-name/{apiDefault['summonerName']}?api_key={apiDefault['key']}"
        response = requests.get(url)
        if response.status_code == 200:
            logging.info(f"summoner_v4 요청 성공.{response.status_code}")
            data = response.json()
            user_infolol.summoner_id = data["id"]
            user_infolol.summoner_puuid = data["puuid"]
            user_infolol.save()

            summoner_league.delay(user_infolol_id)
            return True
        else:
            logging.info(f"summoner_v4 요청 실패.{response.status_code}")
            user_infolol.summoner_name = None
            user_infolol.summoner_tier = None  # 혹시 이밑으로 문제 생기면 39번까지 삭제
            user_infolol.summoner_rank = None
            user_infolol.summoner_lp = None
            user_infolol.summoner_win = None
            user_infolol.summoner_loss = None
            user_infolol.save()
            return False

    except Infolol.DoesNotExist:
        logging.info("Dose not exist Infolol.")
        return False


@shared_task
def summoner_league(user_infolol_id):
    logging.info("start summoner_league")
    try:
        user_infolol = Infolol.objects.get(id=user_infolol_id)
        summoner_id = user_infolol.summoner_id  # 사용자의 summoner_id 가져오기

        apiDefault = {
            "region": "https://kr.api.riotgames.com",
            "key": settings.RIOT_API_KEY,
        }
        url = f"{apiDefault['region']}/lol/league/v4/entries/by-summoner/{summoner_id}?api_key={apiDefault['key']}"
        response = requests.get(url)

        if response.status_code == 200:
            logging.info(f"summoner_league 요청 성공.{response.status_code}")
            league_data = response.json()
            logging.info(f"리그데이터.{league_data}")
            if league_data == []:
                logging.info("소환사가 없거나, 랭크게임을 하지않았습니다. 초기화합니다")
                user_infolol.summoner_name = None
                user_infolol.summoner_tier = None
                user_infolol.summoner_rank = None
                user_infolol.summoner_lp = None
                user_infolol.summoner_win = None
                user_infolol.summoner_loss = None
                user_infolol.save()
                return False
            else:
                user_infolol.summoner_name = league_data[0]["summonerName"]
                user_infolol.summoner_tier = league_data[0]["tier"]
                user_infolol.summoner_rank = league_data[0]["rank"]
                user_infolol.summoner_lp = league_data[0]["leaguePoints"]
                user_infolol.summoner_win = league_data[0]["wins"]
                user_infolol.summoner_loss = league_data[0]["losses"]
                user_infolol.save()
                return True
        else:
            logging.info(f"summoner_league 요청 실패.{response.status_code}")
            return False

    except Infolol.DoesNotExist:
        logging.info("Dose not exist Infolol.")
        return False


@shared_task
def account_v1(user_infoval_id, val_name, val_tag):
    logging.info("start 발로란트 계정확인")
    try:
        user_infoval = Infoval.objects.get(id=user_infoval_id)

        apiDefault = {
            "region": "https://americas.api.riotgames.com",
            "key": settings.RIOT_API_KEY,
            "valName": val_name,
            "valTag": val_tag,
        }
        url = f"{apiDefault['region']}/riot/account/v1/accounts/by-riot-id/{apiDefault['valName']}/{apiDefault['valTag']}?api_key={apiDefault['key']}"
        response = requests.get(url)
        logging.info(f"account_v1 요청 url : {url}")
        if response.status_code == 200:
            logging.info(f"account_v1 요청 성공.{response.status_code}")
            data = response.json()
            user_infoval.val_name = data["gameName"]
            user_infoval.val_tag = data["tagLine"]
            user_infoval.val_puuid = data["puuid"]
            user_infoval.save()
            return True
        else:
            logging.info(f"account_v1 요청 실패.{response.status_code}")
            user_infoval.val_name = None
            user_infoval.val_tag = None
            user_infoval.val_puuid = None
            user_infoval.save()
            return False

    except Infolol.DoesNotExist:
        logging.info("Dose not exist Infoval.")
        return False
