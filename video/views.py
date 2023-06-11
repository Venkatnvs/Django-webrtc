from django.shortcuts import render,redirect
from django.http import HttpResponseNotFound
from .models import Rooms,RoomUsers
from .context_processors import get_data_user
from uuid import UUID

def video_p2p(request):
    return render(request, 'video_p2p/base.html')


def video_p2p_channels(request,room_id):
    if request.method == "GET":
        usernamejs=None
        if request.session.has_key('usernamejs'):
            usernamejs = request.session['usernamejs']
        else:
            return render(request, 'room/join_room.html',{'roomid':room_id})
        try:
            useruuid = UUID(room_id)
        except Exception as e:
            print(e)
            useruuid="none"
            return HttpResponseNotFound('<h1>Page not found 404</h1>')
        room = Rooms.objects.filter(id=useruuid)
        if room.exists():
            room = Rooms.objects.get(id=room_id)
            context = {
                'roomid':room.roomid,
                'user_namejs':usernamejs,
            }
            return render(request, 'video_mesh/channels_index.html',context)
        else:
            return HttpResponseNotFound('<h1>Page not found 404</h1>')
    if request.method == "POST":
        try:
            useruuid = UUID(room_id)
        except Exception as e:
            print(e)
            useruuid="none"
            return HttpResponseNotFound('<h1>Page not found 404</h1>')
        usernamesd = request.POST['username']
        room = Rooms.objects.filter(id=useruuid)
        if room.exists():
            room = Rooms.objects.get(id=room_id)
        else:
            return HttpResponseNotFound('<h1>Page not found 404</h1>')
        usercr,a = RoomUsers.objects.get_or_create(username=usernamesd,room =room)
        request.session['usernamejs'] = usercr.username
        return redirect('video_ch',room_id=room.id)

    return HttpResponseNotFound('<h1>Page not found 404</h1>')


def video_filter_channels(request):
    return render(request, 'video_mesh/filters.html')

def Room_Join(request):
    if request.method == "GET":
        return render(request,"room/index.html")
    if request.method == "POST":
        roomidsd = request.POST['roomid']
        usernamesd = request.POST['username']
        get_data_user(request,user_n=usernamesd)
        roomcr,b = Rooms.objects.get_or_create(roomid= roomidsd)
        usercr,a = RoomUsers.objects.get_or_create(username=usernamesd,room =roomcr)
        request.session['usernamejs'] = usercr.username
        return redirect('video_ch',room_id=roomcr.id)
    return HttpResponseNotFound('<h1>Page not found 404</h1>')