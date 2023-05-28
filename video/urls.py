from django.urls import path
from .views import *

urlpatterns = [
    path('v1/', video_p2p, name='video_v1'),
    path('v2/', video_p2p_2, name='video_v2'),
    path('channel/', video_p2p_channels, name='video_ch'),
]