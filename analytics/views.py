from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.gis.geoip2 import GeoIP2
import socket
from ipware import get_client_ip


def Pagedata(request):
    pass

@api_view(['GET', 'POST'])
def hello_world(request):
    if request.method == 'POST':
        print(request.data)
        return Response({"message": "Got data!", "data": request.data})
    return Response({"message": "Hello, world!"})

@api_view(['GET'])
def get_user_ip_address(request):
    client_ip, re_te = get_client_ip(request)
    print(client_ip,re_te)
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip_address = x_forwarded_for.split(',')[0]
    else:
        ip_address = request.META.get('REMOTE_ADDR')
    return Response({'ip':ip_address})


def get_ip_geolocation(ip_address):
    g = GeoIP2()
    try:
        geolocation = g.city(ip_address)
        return geolocation
    except Exception as e:
        print(f'Error retrieving geolocation: {e}')
        return 'Not Found'
    return None

@api_view(['GET','POST'])
def get_user_ip_geolocation(request):
    if request.method == 'POST':
        print(request.data)
        ip_address = request.data['ip_address']
    else:
        ip_address = '106.216.230.181'
    geolocation = get_ip_geolocation(ip_address)
    # if geolocation:
    #     city = geolocation['city']
    #     country = geolocation['country_name']
    #     latitude = geolocation['latitude']
    #     longitude = geolocation['longitude']
    #    # Process and utilize the geolocation data as needed
    # else:
    #     city = None
    #     # Handle the case where geolocation data is not available or an error occurred
    return Response({"message": geolocation})

