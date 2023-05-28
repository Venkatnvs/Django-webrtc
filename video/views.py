from django.shortcuts import render

def video_p2p(request):
    return render(request, 'video_p2p/base.html')

def video_p2p_2(request):
    return render(request, 'video_p2p/try_video.html')


def video_p2p_channels(request):
    return render(request, 'video_mesh/channels_index.html')