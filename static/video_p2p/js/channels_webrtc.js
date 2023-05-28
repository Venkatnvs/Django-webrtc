const localcamVideo = document.getElementById('local_stream');

const servers = {
  iceServers: [
    {
      urls: [
        "stun:stun1.l.google.com:19302",
        "stun:a.relay.metered.ca:80",
        "stun:stun2.l.google.com:19302",
        "stun:stun3.l.google.com:19302",
        "stun:stun4.l.google.com:19302",
        "stun:stun.freevoipdeal.com:3478",
        "stun:bn-turn1.xirsys.com",
      ],
    },
    {
      urls: "turn:openrelay.metered.ca:80",
      username: "openrelayproject",
      credential: "openrelayproject",
    },
    {
      url: "turn:numb.viagenie.ca",
      credential: "muazkh",
      username: "webrtc@live.com",
    },
    {
      url: "turn:turn.bistri.com:80",
      credential: "homeo",
      username: "homeo",
    },
    {
      url: "turn:turn.anyfirewall.com:443?transport=tcp",
      credential: "webrtc",
      username: "webrtc",
    },
    {
      urls: "turn:a.relay.metered.ca:80",
      username: "69af939fef256835a4f3b00e",
      credential: "lbUFDSyF6j3MVZLd",
    },
    {
      urls: "turn:a.relay.metered.ca:80?transport=tcp",
      username: "69af939fef256835a4f3b00e",
      credential: "lbUFDSyF6j3MVZLd",
    },
    {
      urls: "turn:a.relay.metered.ca:443",
      username: "69af939fef256835a4f3b00e",
      credential: "lbUFDSyF6j3MVZLd",
    },
    {
      urls: "turn:a.relay.metered.ca:443?transport=tcp",
      username: "69af939fef256835a4f3b00e",
      credential: "lbUFDSyF6j3MVZLd",
    },
    {
      username:
        "UEK79BUzSp4OBBEUMDCHPTGOTKJbUueRyfOjjzNVot4LG9RZpoBOZqdaAzCMek32AAAAAGRpDz92ZW5rYXQxMjM=",
      credential: "e4a7926a-f73a-11ed-9f71-0242ac140004",
      urls: [
        "turn:bn-turn1.xirsys.com:80?transport=udp",
        "turn:bn-turn1.xirsys.com:3478?transport=udp",
        "turn:bn-turn1.xirsys.com:80?transport=tcp",
        "turn:bn-turn1.xirsys.com:3478?transport=tcp",
        "turns:bn-turn1.xirsys.com:443?transport=tcp",
        "turns:bn-turn1.xirsys.com:5349?transport=tcp",
      ],
    },
  ],
  iceCandidatePoolSize: 10,
};
let localStream;
let remoteStream;
let peerMaps = {};
let webSocket;
let username='venkat';

let startApp = () =>{
    const urlParams = new URLSearchParams(window.location.search);
    const callI2duu = urlParams.get('id')
    const calluser = urlParams.get('user')
    if(callI2duu && calluser){
        username = calluser
        initialcreate(callI2duu)
    }
}

let webSocketOnMessage = async (event) =>{
    let dataJson = JSON.parse(event.data)
    let dataPeer = dataJson['peer']
    let dataAction = dataJson['action']
    let dataMsg = dataJson['message']
    let dataResChannel = dataJson['message']['reciver_channel_name']
    if(username != dataPeer){
        if(dataAction == 'new-peer'){
            createOffers(dataPeer,dataResChannel)
            return;
        }

        if(dataAction == 'new-offer'){
            let offer = dataJson['message']['sdp'];
            createAnswer(offer,dataPeer,dataResChannel)
            return;
        }
        if(dataAction == 'new-answer'){
            let answer = dataJson['message']['sdp'];
            peerMaps[dataPeer].pc.setRemoteDescription(new RTCSessionDescription(answer));
            return;
        }
    }
    console.log(dataMsg)
}

let initialcreate = async (roomName) =>{
    localStream = await navigator.mediaDevices.getUserMedia({ video: true,  audio:
        {
        autoGainControl: false,
        channelCount: 2,
        echoCancellation: false,
        latency: 0,
        noiseSuppression: false,
        sampleRate: 48000,
        sampleSize: 16,
        volume: 1.0
    }});
    localcamVideo.volume = 0;
    localcamVideo.srcObject = localStream;

    webSocket = new WebSocket(
        'ws://'
        + window.location.host
        + '/ws/webrtc/'
        + roomName
        + '/'
    );

    webSocket.addEventListener('open', (e)=>{
        console.log('connected opened...')
        SendSignal('new-peer','hi')
    });
    webSocket.addEventListener('close', (e)=>{
        console.log('connected closed...')
    });
    webSocket.addEventListener('message', webSocketOnMessage);
    webSocket.addEventListener('error', (e)=>{
        console.log('connected error...')
    });
}

let SendSignal = (action,message) =>{
    let sendData = JSON.stringify({
        'peer':username,
        'action':action,
        'message':message,
    });
    webSocket.send(sendData);
}

let createOffers = async (peerUser, channelName) =>{
    peerMaps[peerUser] = {'pc':new RTCPeerConnection(servers),'name':peerUser};

    localStream.getTracks().forEach((track) => {
        peerMaps[peerUser].pc.addTrack(track, localStream);
    });
    
    let remoteVideo = createVideo(peerUser)
    peerMaps[peerUser].pc.ontrack = event => createOnTrack(event, remoteVideo);
    // createOnTrack(peerMaps[peerUser].pc,remoteVideo);

    peerMaps[peerUser].pc.addEventListener("iceconnectionstatechange", ()=>{
        let icConnState = peerMaps[peerUser].pc.iceConnectionState;

        if(icConnState === 'failed' || icConnState === 'closed' || icConnState === 'disconnected'){
            if(icConnState != 'closed'){
                peerMaps[peerUser].pc.close()
            }
            removeRemoteVid(remoteVideo)
        }
    });

    peerMaps[peerUser].pc.addEventListener("icecandidate", (event)=> {
        if(event.candidate){
            console.log(peerMaps[peerUser].pc.localDescription)
        }
        SendSignal("new-offer",{
            'sdp' : peerMaps[peerUser].pc.localDescription,
            'reciver_channel_name':channelName,
        })
    })

    peerMaps[peerUser].pc.createOffer()
        .then(e => peerMaps[peerUser].pc.setLocalDescription(e))
        .then(()=>{
            console.log('local dec set')
        })
}

let createAnswer = async (offer, peerUser, channelName) => {
    peerMaps[peerUser] = {'pc':new RTCPeerConnection(servers),'name':peerUser};

    localStream.getTracks().forEach((track) => {
        peerMaps[peerUser].pc.addTrack(track, localStream);
    });
    let remoteVideo = createVideo(peerUser)
    peerMaps[peerUser].pc.ontrack = event => createOnTrack(event, remoteVideo);
    // let remoteVideo = createVideo(peerUser)
    // createOnTrack(peerMaps[peerUser].pc,remoteVideo);

    peerMaps[peerUser].pc.addEventListener("iceconnectionstatechange", ()=>{
        let icConnState = peerMaps[peerUser].pc.iceConnectionState;

        if(icConnState === 'failed' || icConnState === 'closed' || icConnState === 'disconnected'){
            if(icConnState != 'closed'){
                peerMaps[peerUser].pc.close()
            }
            removeRemoteVid(remoteVideo)
        }
    });

    peerMaps[peerUser].pc.addEventListener("icecandidate", (event)=> {
        if(event.candidate){
            console.log(peerMaps[peerUser].pc.localDescription)
        }
        SendSignal("new-answer",{
            'sdp' : peerMaps[peerUser].pc.localDescription,
            'reciver_channel_name':channelName,
        })
    })

    peerMaps[peerUser].pc.setRemoteDescription(offer)
        .then(()=>{
            console.log('remote set')
            return peerMaps[peerUser].pc.createAnswer();
        })
        .then(e =>{
            peerMaps[peerUser].pc.setLocalDescription(e);
        })
}

let createVideo = (peerUser) =>{
    const remoteVideo = document.createElement("video");
    remoteVideo.id = peerUser + '-video';
    remoteVideo.autoplay = true;
    remoteVideo.playsInline = true;
    document.getElementById("remoteVideos").appendChild(remoteVideo);
}

let createOnTrack = async (event,remoteVide) =>{
    
    remoteVide.srcObject = event.streams[0];
}

let removeRemoteVid = (video) => {
    video.parentNode.removeChild(video);
}

startApp()