from django.urls import path
from .views import *
from django.views.decorators.csrf import csrf_exempt

urlpatterns = [
    path('get-ip-geolocation', csrf_exempt(get_user_ip_geolocation), name='analytics_ip_geolocation'),
    path('track-page-view', csrf_exempt(track_page_view), name='analytics_v1'),
    path('get-anly-1', csrf_exempt(get_cou_ln_lo), name='analytics_v1_1'),
    path('get-anly-country', csrf_exempt(get_country), name='analytics_v1_2'),
    path('get-anly-device', csrf_exempt(get_device_type), name='analytics_v1_3'),
    path('get-ip-address', csrf_exempt(get_user_ip_address), name='analytics_ip_address'),
    path('', Homepage, name='analytics_page_home'),
]