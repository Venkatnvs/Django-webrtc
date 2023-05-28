from django.urls import re_path
from video.consumer import WebrtcVideo

websocket_urlpatterns = [
    re_path(r"ws/webrtc/(?P<room_name>\w+)/$", WebrtcVideo.as_asgi()),
]