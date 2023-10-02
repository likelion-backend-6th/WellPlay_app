# 샐러리 인스턴스 정의
from __future__ import absolute_import, unicode_literals

import os
from celery import Celery
from celery.schedules import crontab

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings.base")

app = Celery("config")
app.config_from_object("django.conf:settings", namespace="CELERY")

app.conf.broker_url = "redis://wp-redis:6379/0"  # redis 컨테이너 이름과 포트
app.autodiscover_tasks()  # 작업 모듈 자동으로 로드

# # 주기적으로 작업 실행을 예약 (지금은 필요 X)
# app.conf.beat_schedule = {
#     "call-riot-api-every-day": {
#         "task": "account.tasks.update_lol_info",
#         "schedule": crontab(minute=0, hour=0),  # 매일 자정에 실행
#     },
# }
