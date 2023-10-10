from __future__ import absolute_import, unicode_literals
import os
from celery import Celery

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings.base")

app = Celery("config")
app.config_from_object("django.conf:settings", namespace="CELERY")

# 등록된 django apps 내부의 모든 task 모듈을 찾습니다.
app.autodiscover_tasks()
