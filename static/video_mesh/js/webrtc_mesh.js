const localcamVideo = document.getElementById('local_stream')
const camBtn = document.getElementById('camera-btn');
const micBtn = document.getElementById('mic-btn');
const endBtn = document.getElementById('leave-btn');
const controlBtn = document.getElementById('controls');
const partCnt = document.getElementById("partc_head_count")
const screenshareButton = document.getElementById('screenshareButton');
const switchCamButton = document.getElementById('switchCamButton');
const grayBtn = document.getElementById("convertGray");
let statedCallShare=false;
let mobileDevCh = true;
const RoomIdfromHtml = JSON.parse(document.getElementById('user_roomid').textContent);
const UserNamefromHtml = JSON.parse(document.getElementById('user_name').textContent);
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
let micChof = true;
let camChof = true;
var localUuid;
var localDisplayName;
var localStream;
var localStream3;
var serverConnection;
let constraints;
var peerConnections = {}; // key is uuid, values are peer connection object and user defined display name string

function start() {
  localUuid = createUUID();

  // check if "&displayName=xxx" is appended to URL, otherwise alert user to populate
  var urlParams = new URLSearchParams(window.location.search);
  if(UserNamefromHtml){
    localDisplayName = UserNamefromHtml
  }
  else{
    localDisplayName = urlParams.get('displayName') || prompt('Enter your name', '');
  }
  if(!localDisplayName){
    alert("Please enter your Name")
    location.reload()
    return;
  }
  let check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  // return check;
  mobileDevCh = check
  console.log("fgbh",check)
  if(check){
    document.getElementById("screenshareButton").style.display = 'none';
    constraints = { video: {
      facingMode: 'user'
      },  audio:
      {
      autoGainControl: false,
      channelCount: 2,
      echoCancellation: false,
      latency: 0,
      noiseSuppression: false,
      sampleRate: 48000,
      sampleSize: 16,
      volume: 1.0
    }};
  }else{
    document.getElementById("switchCamButton").style.display = "none"
    constraints = { video: true,  audio:
      {
      autoGainControl: false,
      channelCount: 2,
      echoCancellation: false,
      latency: 0,
      noiseSuppression: false,
      sampleRate: 48000,
      sampleSize: 16,
      volume: 1.0
    }};
  }
  document.getElementById("local_relat").appendChild(makeLabel('You '));
  addUserAspart(localDisplayName+" (you)",localUuid)

  // specify no audio for user media
  // mandatory:{
  //   maxWidth : 800,
  //   maxHeight : 600,
  // }
  constraints = { video: {
    facingMode: 'user'
  },  audio:
    {
    autoGainControl: false,
    channelCount: 2,
    echoCancellation: false,
    latency: 0,
    noiseSuppression: false,
    sampleRate: 48000,
    sampleSize: 16,
    volume: 1.0
    }};

  // set up local video stream
  if (navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia(constraints)
      .then(stream => {
        localStream = stream;
        localcamVideo.srcObject = stream;
        localcamVideo.volume = 0;
      }).catch(errorHandler)

      // set up websocket and message all existing clients
      .then(() => {
        serverConnection = new WebSocket('wss://'
        + window.location.host
        + '/ws/webrtc/'
        + RoomIdfromHtml
        + '/');
        serverConnection.onmessage = gotMessageFromServer;
        serverConnection.onopen = event => {
          serverConnection.send(JSON.stringify({ 'displayName': localDisplayName, 'uuid': localUuid, 'dest': 'all' }));
        }
      }).catch(errorHandler);

  } else {
    alert('Your browser does not support getUserMedia API');
  }
}

function gotMessageFromServer(message) {
  var signal = JSON.parse(message.data);
  var peerUuid = signal.uuid;

  // Ignore messages that are not for us or from ourselves
  if (peerUuid == localUuid || (signal.dest != localUuid && signal.dest != 'all')) return;

  if (signal.displayName && signal.dest == 'all') {
    // set up peer connection object for a newcomer peer
    setUpPeer(peerUuid, signal.displayName);
    serverConnection.send(JSON.stringify({ 'displayName': localDisplayName, 'uuid': localUuid, 'dest': peerUuid }));

  } else if (signal.displayName && signal.dest == localUuid) {
    // initiate call if we are the newcomer peer
    setUpPeer(peerUuid, signal.displayName, true);

  }else if (signal.sdp) {
    peerConnections[peerUuid].pc.setRemoteDescription(new RTCSessionDescription(signal.sdp)).then(function () {
      // Only create answers in response to offers
      if (signal.sdp.type == 'offer') {
        peerConnections[peerUuid].pc.createAnswer().then(description => createdDescription(description, peerUuid)).catch(errorHandler);
      }
    }).catch(errorHandler);

  } else if (signal.ice) {
    peerConnections[peerUuid].pc.addIceCandidate(new RTCIceCandidate(signal.ice)).catch(errorHandler);
  }
}

function setUpPeer(peerUuid, displayName, initCall = false) {
  peerConnections[peerUuid] = { 'displayName': displayName, 'pc': new RTCPeerConnection(servers) };
  peerConnections[peerUuid].pc.onicecandidate = event => gotIceCandidate(event, peerUuid);
  peerConnections[peerUuid].pc.ontrack = event => gotRemoteStream(event, peerUuid);
  peerConnections[peerUuid].pc.oniceconnectionstatechange = async (event) => checkPeerDisconnect(event, peerUuid);
  peerConnections[peerUuid].pc.addStream(localStream);

  if (initCall) {
    peerConnections[peerUuid].pc.createOffer().then(description => createdDescription(description, peerUuid)).catch(errorHandler);
  }
}

function gotIceCandidate(event, peerUuid) {
  if (event.candidate != null) {
    serverConnection.send(JSON.stringify({ 'ice': event.candidate, 'uuid': localUuid, 'dest': peerUuid }));
  }
}

function createdDescription(description, peerUuid) {
  description.sdp = description.sdp.replace('useinbandfec=1', 'useinbandfec=1; stereo=1; maxaveragebitrate=510000');
  // console.log("ven",description)
  console.log(`got description, peer ${peerUuid}`);
  peerConnections[peerUuid].pc.setLocalDescription(description).then(function () {
    serverConnection.send(JSON.stringify({ 'sdp': peerConnections[peerUuid].pc.localDescription, 'uuid': localUuid, 'dest': peerUuid }));
  }).catch(errorHandler);
}

function gotRemoteStream(event, peerUuid) {
  console.log(event)
  if(event.track.kind == 'audio'){
      return;
  }
  console.log(`got remote stream, peer ${peerUuid}`);
  //assign stream to new HTML video element
  var vidElement = document.createElement('video');
  vidElement.setAttribute('autoplay', '');
  vidElement.setAttribute('muted', '');
  vidElement.srcObject = event.streams[0];

  var vidContainer = document.createElement('div');
  vidContainer.setAttribute('id', 'remoteVideo_' + peerUuid);
  // vidContainer.classList.add('videoContainer');
  vidContainer.setAttribute('class', 'videoContainer');
  vidContainer.appendChild(vidElement);
  vidContainer.appendChild(makeLabel(peerConnections[peerUuid].displayName));
  vidContainer.appendChild(pinRemvd(peerUuid));
  // dragElement(vidContainer)
  document.getElementById('remoteVideos').appendChild(vidContainer);
  addUserAspart(peerConnections[peerUuid].displayName,peerUuid);
//   updateLayout();
}

function addUserAspart(name,peerid){
  var liElement = document.createElement('li');
  liElement.setAttribute('id', 'remotepartname_' + peerid);
  liElement.classList.add('list-group-item','m-1','p-0');
  liEmHtml = `<i class="bi bi-person text-light"></i>&nbsp;&nbsp;<spam>${name}</spam>`
  liElement.innerHTML=liEmHtml;
  let partcCount = Object.keys(peerConnections).length
  partCnt.innerText = partcCount + 1
  document.getElementById("user_part_name").appendChild(liElement);
}

function checkPeerDisconnect(event, peerUuid) {
  var state = peerConnections[peerUuid].pc.iceConnectionState;
  console.log(`connection with peer ${peerUuid} ${state}`);
  if (state === "failed" || state === "closed" || state === "disconnected") {
    delete peerConnections[peerUuid];
    document.getElementById('remoteVideos').removeChild(document.getElementById('remoteVideo_' + peerUuid));
    document.getElementById("user_part_name").removeChild(document.getElementById('remotepartname_'+peerUuid));
    let partcCount = Object.keys(peerConnections).length
    partCnt.innerText = partcCount + 1
  }
}

function makeLabel(label) {
  var vidLabel = document.createElement('div');
  vidLabel.appendChild(document.createTextNode(label));
  vidLabel.setAttribute('class', 'videoLabel');
  return vidLabel;
}
function pinRemvd(peeruuid) {
  var vidPinvd = document.createElement('div');
  vidPinvd.setAttribute('id', 'remotepartnamepin_' + peeruuid);
  vidPinvd.innerHTML = `<i class="bi bi-pin"></i>`
  vidPinvd.setAttribute('class', 'videoPin');
  vidPinvd.addEventListener('click',(e)=>{OnPinClick(e,peeruuid)})
  return vidPinvd;
}

function OnPinClick(e,peerid) {
  console.log(peerid)
  let rmtvd = e.target.parentElement.parentElement
  console.log(document.getElementById('remotepartnamepin_'+peerid),e.target.parentElement)
  rmtvd.removeChild(document.getElementById('remotepartnamepin_'+peerid));
  let loc = document.getElementsByClassName('local_relat')
  console.log("dfui",loc)
  let temloc2 = loc[0]
  
  temloc2.appendChild(pinRemvd('localuser'));
  console.log("hhhhh")
  
  temloc2.setAttribute('class','videoContainer')
  rmtvd.setAttribute('class','local_relat')
  document.getElementById('remoteVideos').appendChild(temloc2);
  document.getElementById('local_cont').appendChild(rmtvd)
}

function errorHandler(error) {
  console.log(error);
}

micBtn.onclick = async () => {
  console.log('mic')
  let audioTrack = localStream.getTracks().find(track => track.kind === 'audio')
  
  if(audioTrack.enabled){
      micChof=false
      audioTrack.enabled = false
      document.getElementById('mic-btn').style.backgroundColor = 'rgb(255, 80, 80)'
  }else{
      micChof=true
      audioTrack.enabled = true
      document.getElementById('mic-btn').style.backgroundColor = 'rgb(179, 102, 249, .9)'
  }
}
camBtn.onclick = async () => {
let videoTrack = localStream.getTracks().find(track => track.kind === 'video')

if(videoTrack.enabled){
    camChof=false
    videoTrack.enabled = false
    document.getElementById('camera-btn').style.backgroundColor = 'rgb(255, 80, 80)'
}else{
    camChof=true
    videoTrack.enabled = true
    document.getElementById('camera-btn').style.backgroundColor = 'rgb(179, 102, 249, .9)'
}
}

endBtn.onclick = async () => {
localStream.getTracks().forEach(function(track) {
  track.stop();
});
localStream = null;
let allper = Object.keys(peerConnections)
for(let i=0;i<allper.length;i++){
  // console.log(i,allper)
  peerConnections[allper[i]].pc.close()
}
location.reload();
}


screenshareButton.onclick = async () =>{
  if(!statedCallShare){
    localStream3 = await navigator.mediaDevices.getDisplayMedia({ video: true,  audio:
      {
      autoGainControl: false,
      channelCount: 2,
      echoCancellation: false,
      latency: 0,
      noiseSuppression: false,
      sampleRate: 48000,
      sampleSize: 16,
      volume: 1.0
    } });
    const newVideoTrack = localStream3.getVideoTracks()[0];
    const newAudioTrack = localStream3.getAudioTracks()[0];
    if(newVideoTrack && newVideoTrack.kind !== 'video'){
      console.log(newVideoTrack.kind)
    }
    if(newAudioTrack && newAudioTrack.kind !== 'audio'){
      console.log(newAudioTrack.kind)
    }
    let allper = Object.keys(peerConnections)
    for(let i=0;i<allper.length;i++){
      // console.log(i,allper)
      peerConnections[allper[i]].pc.getSenders().forEach(async s => {
        if(s.track && s.track.kind==='video' && newVideoTrack && newVideoTrack.kind === 'video'){
          await s.replaceTrack(newVideoTrack)
        }
        if(s.track && s.track.kind==='audio' && newAudioTrack &&  newAudioTrack.kind === 'audio'){
          await s.replaceTrack(newAudioTrack)
        }
      });
    }
    localStream = null;
    localcamVideo.srcObject = null;
    localStream = localStream3;
    localcamVideo.srcObject = localStream;
    localcamVideo.volume = 0;
    statedCallShare = true;
    document.getElementById("screenshareButton_img").src = '/static/video_mesh/icons/stop_screenShare.png'
    localStream3.getVideoTracks()[0].addEventListener('ended',() => {
      StopScreenShare();
    });
  }
  else{
    StopScreenShare();
  }
  }


let StopScreenShare = async () =>{
  localStream3.getVideoTracks()[0].enabled = false
  let tracks = localcamVideo.srcObject.getTracks();
  tracks.forEach((track) => track.stop());
  localcamVideo.srcObject = null;
  statedCallShare = false;
  console.log('hiiiiiiiiiiiiiii')
  document.getElementById("screenshareButton_img").src = '/static/video_p2p/icons/screen_share.png'
  let localStream = await navigator.mediaDevices.getUserMedia(constraints);
  const newVideoTrack = localStream.getVideoTracks()[0];
  const newAudioTrack = localStream.getAudioTracks()[0];
  if(newVideoTrack && newVideoTrack.kind !== 'video'){
    console.log(newVideoTrack.kind)
  }
  if(newAudioTrack && newAudioTrack.kind !== 'audio'){
    console.log(newAudioTrack.kind)
  }
  let allper = Object.keys(peerConnections)
  for(let i=0;i<allper.length;i++){
    // console.log(i,allper)
    peerConnections[allper[i]].pc.getSenders().forEach(async s => {
      if(s.track && s.track.kind==='video' && newVideoTrack &&  newVideoTrack.kind === 'video'){
        await s.replaceTrack(newVideoTrack)
      }
      if(s.track && s.track.kind==='audio' && newAudioTrack &&  newAudioTrack.kind === 'audio'){
        await s.replaceTrack(newAudioTrack)
      }
    });
  }
  console.log(localStream)
  localcamVideo.srcObject = localStream;
  localcamVideo.volume = 0;
  if(!micChof){
    let audioTrack = localStream.getTracks().find(track => track.kind === 'audio')
    audioTrack.enabled = false
  }
}


switchCamButton.onclick = async () => {
  if(!mobileDevCh){
    return;
  }
  if(constraints.video.facingMode==='user'){
    constraints.video.facingMode='environment';
  }
  else{
    constraints.video.facingMode='user'
  }
  let tracks = localcamVideo.srcObject.getTracks();
  tracks.forEach((track) => track.stop());
  localStream = null;
  localcamVideo.srcObject = null;
  localStream = await navigator.mediaDevices.getUserMedia(constraints);
  const newVideoTrack = localStream.getVideoTracks()[0];
  const newAudioTrack = localStream.getAudioTracks()[0];
  if(newVideoTrack && newVideoTrack.kind !== 'video'){
    console.log(newVideoTrack.kind)
  }
  if(newAudioTrack && newAudioTrack.kind !== 'audio'){
    console.log(newAudioTrack.kind)
  }
  let allper = Object.keys(peerConnections)
  for(let i=0;i<allper.length;i++){
    // console.log(i,allper)
    peerConnections[allper[i]].pc.getSenders().forEach(async s => {
      if(s.track && s.track.kind==='video' && newVideoTrack &&  newVideoTrack.kind === 'video'){
        await s.replaceTrack(newVideoTrack)
      }
      if(s.track && s.track.kind==='audio' && newAudioTrack &&  newAudioTrack.kind === 'audio'){
        await s.replaceTrack(newAudioTrack)
      }
    });
  }
  localcamVideo.srcObject = localStream;
  localcamVideo.volume = 0;
  if(!micChof){
    let audioTrack = localStream.getTracks().find(track => track.kind === 'audio')
    audioTrack.enabled = false
  }
  if(!camChof){
    let videoTrack = localStream.getTracks().find(track => track.kind === 'video')
    videoTrack.enabled = false
  }
}


grayBtn.onclick = async () =>{
  // Create a video output element
  const videoOutput = document.getElementById('local_stream2');
  let grayScale = new MediaStream();
  videoOutput.srcObject = grayScale;
  // Create an empty canvas for rendering
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d',{willReadFrequently:true});

  // Process video frames
  function processVideoFrame() {
    // Draw the current video frame onto the canvas
    ctx.drawImage(localcamVideo, 0, 0, canvas.width, canvas.height);

    // Convert the canvas to an OpenCV Mat object
    const frame = cv.imread(canvas);

    // Convert the frame to grayscale
    cv.cvtColor(frame, frame, cv.COLOR_RGBA2GRAY);

    // Render the processed frame onto the canvas
    cv.imshow(canvas, frame);

    // Convert the canvas back to an image data URL
    // const imageDataUrl = canvas.toDataURL('image/png');
    const stream1= canvas.captureStream();
    // videoOutput.srcObject = stream1;
    // videoOutput.src = URL.createObjectURL(stream1);
    // if ('srcObject' in videoOutput) {
    //   videoOutput.srcObject = stream1;
    // } else {
    //   videoOutput.src = URL.createObjectURL(stream1);
    // }
            // return;
    stream1.getTracks().forEach((track) => {
      grayScale.addTrack(track);
    });
    const newVideoTrack = stream1.getVideoTracks()[0];
    let allper = Object.keys(peerConnections)
    for(let i=0;i<allper.length;i++){
      // console.log(i,allper)
      peerConnections[allper[i]].pc.getSenders().forEach(async s => {
        if(s.track && s.track.kind==='video' && newVideoTrack &&  newVideoTrack.kind === 'video'){
          await s.replaceTrack(newVideoTrack)
        }
      });
    }

    // Set the image data URL as the source of the video element
    // videoOutput.src = imageDataUrl;

    // Clean up
    frame.delete();

    // Call processVideoFrame recursively to continuously process frames
    requestAnimationFrame(processVideoFrame);
  }

  // Start processing video frames
  processVideoFrame();
}






// Taken from http://stackoverflow.com/a/105074/515584
// Strictly speaking, it's not a real UUID, but it gets the job done here
function createUUID() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  }

  return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

start()