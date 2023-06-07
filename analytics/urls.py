from django.urls import path
from .views import *
from django.views.decorators.csrf import csrf_exempt

urlpatterns = [
    path('track-page-view', csrf_exempt(hello_world), name='analytics_v1'),
    path('get-ip-address', csrf_exempt(get_user_ip_address), name='analytics_ip_address'),
    path('get-ip-geolocation', csrf_exempt(get_user_ip_geolocation), name='analytics_ip_geolocation'),
]