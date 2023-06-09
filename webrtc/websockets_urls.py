from django.urls import re_path
from video.consumer import WebrtcVideo
from analytics.consumer import WebrtcRealTime

websocket_urlpatterns = [
    re_path(r"ws/webrtc/(?P<room_name>\w+)/$", WebrtcVideo.as_asgi()),
    re_path(r"ws/realtime/(?P<user_uuid>[^/]+)/(?P<user_pk>[^/]+)/$", WebrtcRealTime.as_asgi()),
]