from abc import ABCMeta, abstractmethod
import uuid

import boto3
from django.core.files.base import File
from django.conf import settings


class Uploader(metaclass=ABCMeta):
    service_name = "s3"
    endpoint_url = "https://kr.object.ncloudstorage.com"
    access_key = ""
    secret_key = ""
    bucket_name = "wellplay"
    file: File = None

    def __init__(self, access_key, secret_key):
        self.access_key = access_key
        self.secret_key = secret_key

    @abstractmethod
    def upload(self):
        ...


class FileUploader(Uploader):
    def __init__(self, access_key, secret_key, file: File):
        self.file = file
        super().__init__(access_key, secret_key)

    def upload(self):
        s3 = boto3.client(
            service_name=self.service_name,
            endpoint_url=self.endpoint_url,
            aws_access_key_id=self.access_key,
            aws_secret_access_key=self.secret_key,
        )

        # s3 upload
        file = self.file
        file_id = str(uuid.uuid4())
        ext = file.name.split(".")[-1]
        filename = f"{file_id}.{ext}"
        s3.upload_fileobj(file.file, self.bucket_name, filename)

        # get url
        s3.put_object_acl(ACL="public-read", Bucket=self.bucket_name, Key=filename)
        file_url = f"{self.endpoint_url}/{self.bucket_name}/{filename}"
        return file_url
