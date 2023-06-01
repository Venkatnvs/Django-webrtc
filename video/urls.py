from django.urls import path
from .views import *

urlpatterns = [
    path('v1/', video_p2p, name='video_v1'),
    path('f1/', video_filter_channels, name='video_f1'),
    path('channel/<room_id>', video_p2p_channels, name='video_ch'),
    path('', Room_Join, name='room_join'),
]