from celery import Task
from celery import shared_task
import requests
from .models import Infolol


@shared_task
def save_info_lol_data(info_lol_id, data):
    try:
        info_lol = Infolol.objects.get(id=info_lol_id)
        # 여기서 info_lol 데이터를 가공하거나 추가 작업을 수행할 수 있습니다.

        info_lol.save()
        print("LOL 데이터 저장 성공")
    except info_lol.DoesNotExist:
        pass
