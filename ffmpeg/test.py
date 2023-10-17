import ffmpeg
import os

# files = os.listdir()
# for file in files:
#     if file.endswith(".mp4"):
#         ffmpeg.input(file).output("resized/" + file, crf=30).run()
#         print(file)


def resized_mp4(file):
    if file.endswith(".mp4"):
        resized = ffmpeg.input(file).output(f"resized-{file}", crf=30).run()
    return resized


resized_file = resized_mp4("sample.mp4")
print(resized_file)
