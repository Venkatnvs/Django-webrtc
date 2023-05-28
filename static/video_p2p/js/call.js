const firebaseConfig = {
  apiKey: "AIzaSyB28gXhdG2W5QcEGwXXZ9J6dWf466jl2J0",
  authDomain: "chat-68466.firebaseapp.com",
  databaseURL: "https://chat-68466-default-rtdb.firebaseio.com",
  projectId: "chat-68466",
  storageBucket: "chat-68466.appspot.com",
  messagingSenderId: "600077443929",
  appId: "1:600077443929:web:aaec02b92b3599ba8f2248",
  measurementId: "G-N44M9QF0MZ"
};
const app = firebase.initializeApp(firebaseConfig);
const analytics = firebase.analytics()
const firestore = firebase.firestore();
const servers = {
iceServers: [
  {
    urls: [
      'stun:stun1.l.google.com:19302',
      "stun:a.relay.metered.ca:80",
      'stun:stun2.l.google.com:19302',
      'stun:stun3.l.google.com:19302',
      'stun:stun4.l.google.com:19302',
      'stun:stun.freevoipdeal.com:3478',
      'stun:bn-turn1.xirsys.com',
    ],
  },
  {
      urls: 'turn:openrelay.metered.ca:80',
      username: 'openrelayproject',
      credential: 'openrelayproject'
  },{
  url: 'turn:numb.viagenie.ca',
  credential: 'muazkh',
  username: 'webrtc@live.com'
},
{
  url: 'turn:turn.bistri.com:80',
  credential: 'homeo',
  username: 'homeo'
},
{
  url: 'turn:turn.anyfirewall.com:443?transport=tcp',
  credential: 'webrtc',
  username: 'webrtc'
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
  username: "UEK79BUzSp4OBBEUMDCHPTGOTKJbUueRyfOjjzNVot4LG9RZpoBOZqdaAzCMek32AAAAAGRpDz92ZW5rYXQxMjM=",
  credential: "e4a7926a-f73a-11ed-9f71-0242ac140004",
  urls: [
      "turn:bn-turn1.xirsys.com:80?transport=udp",
      "turn:bn-turn1.xirsys.com:3478?transport=udp",
      "turn:bn-turn1.xirsys.com:80?transport=tcp",
      "turn:bn-turn1.xirsys.com:3478?transport=tcp",
      "turns:bn-turn1.xirsys.com:443?transport=tcp",
      "turns:bn-turn1.xirsys.com:5349?transport=tcp"
      ]
  },
],
  iceCandidatePoolSize: 10,
};

// Global State
const pc = new RTCPeerConnection(servers);
let localStream;
let remoteStream;
let offerAnsId;
let callI2duu;
let options;
let localStream2;
let localStream3;
let statedCallShare=false;

// HTML elements

const screenshareButton = document.getElementById('screenshareButton');
const webcamButton = document.getElementById('webcamButton');
const webcamVideo = document.getElementById('webcamVideo');
const remoteVideo = document.getElementById('remoteVideo');
const camBtn = document.getElementById('camera-btn');
const micBtn = document.getElementById('mic-btn');
const endBtn = document.getElementById('leave-btn');
const controlBtn = document.getElementById('controls');
const copyBtn = document.getElementById('copy_d');

// 1. Setup media sources
webcamButton.onclick = async () =>{
// screenshareButton.disabled=true;
increatemed('web');
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
  console.log(localStream3.getVideoTracks())
  const newVideoTrack = localStream3.getVideoTracks()[0];
  const newAudioTrack = localStream3.getAudioTracks()[0];
  if(newVideoTrack.kind !== 'video'){
    console.log(newVideoTrack.kind)
  }
  if(newAudioTrack.kind !== 'audio'){
    console.log(newAudioTrack.kind)
  }
  pc.getSenders().forEach(async s => {
    if(s.track && s.track.kind==='video'){
      await s.replaceTrack(newVideoTrack)
    }
    if(s.track && s.track.kind==='audio'){
      await s.replaceTrack(newAudioTrack)
    }
  });
  webcamVideo.srcObject = localStream3;
  statedCallShare = true;
  document.getElementById("screenshareButton_img").src = '/static/video_p2p/icons/stop_screenShare.png'
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
let tracks = webcamVideo.srcObject.getTracks();
tracks.forEach((track) => track.stop());
webcamVideo.srcObject = null;
statedCallShare = false;
console.log('hiiiiiiiiiiiiiii')
document.getElementById("screenshareButton_img").src = '/static/video_p2p/icons/screen_share.png'
localStream = await navigator.mediaDevices.getUserMedia(options);
const newVideoTrack = localStream.getVideoTracks()[0];
const newAudioTrack = localStream.getAudioTracks()[0];
if(newVideoTrack.kind !== 'video'){
  console.log(newVideoTrack.kind)
}
if(newAudioTrack.kind !== 'audio'){
  console.log(newVideoTrack.kind)
}
pc.getSenders().forEach(async s => {
  if(s.track && s.track.kind=='video'){
    await s.replaceTrack(newVideoTrack)
  }
  else if(s.track && s.track.kind=='audio'){
    await s.replaceTrack(newAudioTrack)
  }
});
webcamVideo.srcObject = localStream;
}

let increatemed = async (data) => {
if(data == 'web'){
  options = {
  video:{
      // width:{min:640, ideal:1920, max:1920},
      // height:{min:480, ideal:1080, max:1080},
      facingMode: 'environment', // Or 'environment'
  },
  audio:
    {
    autoGainControl: false,
    channelCount: 2,
    echoCancellation: false,
    latency: 0,
    noiseSuppression: false,
    sampleRate: 48000,
    sampleSize: 16,
    volume: 1.0
  } };
  localStream = await navigator.mediaDevices.getUserMedia(options);
  webcamVideo.volume = 0;
}
else if(data = 'screen'){
  localStream = await navigator.mediaDevices.getDisplayMedia({ video: true,  audio:
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
}
remoteStream = new MediaStream();

// Push tracks from local stream to peer connection
localStream.getTracks().forEach((track) => {
  pc.addTrack(track, localStream);
});

// Pull tracks from remote stream, add to video stream
pc.ontrack = (event) => {
  event.streams[0].getTracks().forEach((track) => {
    remoteStream.addTrack(track);
  });
};

webcamVideo.srcObject = localStream;
remoteVideo.srcObject = remoteStream;
webcamButton.disabled = true;
// screenshareButton.disabled=true;
controlBtn.style.display='flex';
copyBtn.style.display='flex';
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
// const callIduu = urlParams.get('m')
callI2duu = urlParams.get('id')
const roomRef = firestore.collection("calls").doc(callI2duu);
const roomAns = roomRef.collection('answerCandidates')
const roomSnapshot = await roomRef.get();
const roomSnapshot1 = await roomAns.get();
console.log(roomSnapshot)
if(!roomSnapshot.exists){
  createCalloffer(callI2duu);
  console.log('added')
}
else if(roomSnapshot.exists && !roomSnapshot1.exists){
  answerCallId(callI2duu);
  console.log('ans')
}
else{
  alert("Wrong url.Please Try Again");
  location.reload();
  return;
}
};

// 2. Create an offer
let createCalloffer = async (unid) => {
// Reference Firestore collections for signaling
const callDoc = firestore.collection('calls').doc(unid);
const offerCandidates = callDoc.collection('offerCandidates');
const answerCandidates = callDoc.collection('answerCandidates');

offerAnsId = callDoc.id;

// Get candidates for caller, save to db
pc.onicecandidate = (event) => {
  event.candidate && offerCandidates.add(event.candidate.toJSON());
};

// Create offer
const offerDescription = await pc.createOffer();
await pc.setLocalDescription(offerDescription);

const offer = {
  sdp: offerDescription.sdp,
  type: offerDescription.type,
};

await callDoc.set({ offer });

// Listen for remote answer
callDoc.onSnapshot((snapshot) => {
  const data = snapshot.data();
  if (!pc.currentRemoteDescription && data?.answer) {
    console.log("bbbbbbbbbbbbbbbbbbbbbbbb")
    remoteVideo.classList.remove('display_no');
    webcamVideo.classList.add('smallFrame');
    if(webcamVideo.classList.contains('smallFrame')){
      dragElement(webcamVideo);
    }
    copyBtn.style.display='none';
    const answerDescription = new RTCSessionDescription(data.answer);
    pc.setRemoteDescription(answerDescription);
  }
});

// When answered, add candidate to peer connection
answerCandidates.onSnapshot((snapshot) => {
  snapshot.docChanges().forEach((change) => {
    if (change.type === 'added') {
      const candidate = new RTCIceCandidate(change.doc.data());
      pc.addIceCandidate(candidate);
    }
  });
});
};

// 3. Answer the call with the unique ID
let answerCallId = async (dataId) => {
const callId = dataId;
const callDoc = firestore.collection('calls').doc(callId);
const answerCandidates = callDoc.collection('answerCandidates');
const offerCandidates = callDoc.collection('offerCandidates');
remoteVideo.classList.remove('display_no');
webcamVideo.classList.add('smallFrame');
if(webcamVideo.classList.contains('smallFrame')){
  dragElement(webcamVideo);
}
copyBtn.style.display='none';
pc.onicecandidate = (event) => {
  event.candidate && answerCandidates.add(event.candidate.toJSON());
};

const callData = (await callDoc.get()).data();
console.log(callData)
const offerDescription = callData.offer;
await pc.setRemoteDescription(new RTCSessionDescription(offerDescription));

const answerDescription = await pc.createAnswer();
answerDescription.sdp = answerDescription.sdp.replace('useinbandfec=1', 'useinbandfec=1; stereo=1; maxaveragebitrate=510000');
await pc.setLocalDescription(answerDescription);

const answer = {
  type: answerDescription.type,
  sdp: answerDescription.sdp,
};

await callDoc.update({ answer });

offerCandidates.onSnapshot((snapshot) => {
  snapshot.docChanges().forEach((change) => {
    console.log(change);
    if (change.type === 'added') {
      let data = change.doc.data();
      pc.addIceCandidate(new RTCIceCandidate(data));
    }
  });
});
};

micBtn.onclick = async () => {
let audioTrack = localStream.getTracks().find(track => track.kind === 'audio')

if(audioTrack.enabled){
    audioTrack.enabled = false
    document.getElementById('mic-btn').style.backgroundColor = 'rgb(255, 80, 80)'
}else{
    audioTrack.enabled = true
    document.getElementById('mic-btn').style.backgroundColor = 'rgb(179, 102, 249, .9)'
}
}
camBtn.onclick = async () => {
let videoTrack = localStream.getTracks().find(track => track.kind === 'video')

if(videoTrack.enabled){
    videoTrack.enabled = false
    document.getElementById('camera-btn').style.backgroundColor = 'rgb(255, 80, 80)'
}else{
    videoTrack.enabled = true
    document.getElementById('camera-btn').style.backgroundColor = 'rgb(179, 102, 249, .9)'
}
}
endBtn.onclick = async () => {
localStream.getTracks().forEach(function(track) {
  track.stop();
});
firestore.collection("calls").doc(callI2duu).delete().then(() => {
    console.log("Document successfully deleted!");
}).catch((error) => {
    console.error("Error removing document: ", error);
});
location.reload();
}

copyBtn.onclick = async () => {
const copyUrl = `${window.location.protocol}//${window.location.hostname}${window.location.port}/room/?id=${offerAnsId}`
console.log(window.location.href.split("?")[0])
navigator.clipboard.writeText(copyUrl);
alert("Copied link : " + copyUrl);
}

function dragElement(elmnt) {
var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
if (document.getElementById(elmnt.id + "header")) {
  // if present, the header is where you move the DIV from:
  document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
  document.getElementById(elmnt.id + "header").ontouchstart = dragMouseDown;
} else {
  // otherwise, move the DIV from anywhere inside the DIV:
  elmnt.onmousedown = dragMouseDown;
  elmnt.ontouchstart = dragMouseDown;
}

function dragMouseDown(e) {
  e = e || window.event;
  e.preventDefault();

  //Get touch or click position
  //https://stackoverflow.com/a/41993300/5078983
  if (e.type == 'touchstart' || e.type == 'touchmove' || e.type == 'touchend' || e.type == 'touchcancel') {
      let evt = (typeof e.originalEvent === 'undefined') ? e : e.originalEvent;
      let touch = evt.touches[0] || evt.changedTouches[0];
      x = touch.pageX;
      y = touch.pageY;
  } else if (e.type == 'mousedown' || e.type == 'mouseup' || e.type == 'mousemove' || e.type == 'mouseover' || e.type == 'mouseout' || e.type == 'mouseenter' || e.type == 'mouseleave') {
      x = e.clientX;
      y = e.clientY;
  }

  console.log("drag start x: "+x+" y:"+y);

  // get the mouse cursor position at startup:
  pos3 = x;
  pos4 = y;
  document.onmouseup = closeDragElement;
  document.ontouchend = closeDragElement;
  // call a function whenever the cursor moves:
  document.onmousemove = elementDrag;
  document.ontouchmove = elementDrag;
}

function elementDrag(e) {
  e = e || window.event;
  e.preventDefault();

  //Get touch or click position
  //https://stackoverflow.com/a/41993300/5078983
  if (e.type == 'touchstart' || e.type == 'touchmove' || e.type == 'touchend' || e.type == 'touchcancel') {
      let evt = (typeof e.originalEvent === 'undefined') ? e : e.originalEvent;
      let touch = evt.touches[0] || evt.changedTouches[0];
      x = touch.pageX;
      y = touch.pageY;
  } else if (e.type == 'mousedown' || e.type == 'mouseup' || e.type == 'mousemove' || e.type == 'mouseover' || e.type == 'mouseout' || e.type == 'mouseenter' || e.type == 'mouseleave') {
      x = e.clientX;
      y = e.clientY;
  }

  // calculate the new cursor position:
  pos1 = pos3 - x;
  pos2 = pos4 - y;
  pos3 = x;
  pos4 = y;
  // set the element's new position:
  elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
  elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
}

function closeDragElement() {
  console.log("drag end x: "+pos3+" y:"+pos4);
  // stop moving when mouse button is released:
  document.onmouseup = null;
  document.ontouchcancel = null; //added touch event
  document.ontouchend = null; //added touch event
  document.onmousemove = null;
  document.ontouchmove = null; //added touch event
}
}

webcamVideo.ondblclick = async () => {
if(webcamVideo.classList.contains('smallFrame')){
  webcamVideo.classList.remove('smallFrame');
  if(!remoteVideo.classList.contains('smallFrame')){
    remoteVideo.classList.add('smallFrame');
    dragElement(remoteVideo);
  }
}
}
remoteVideo.ondblclick = async () => {
if(remoteVideo.classList.contains('smallFrame')){
  remoteVideo.classList.remove('smallFrame');
  if(!webcamVideo.classList.contains('smallFrame')){
    webcamVideo.classList.add('smallFrame');
    dragElement(webcamVideo);
  }
}
}

let leaveChannel = async () => {
localStream.getTracks().forEach(function(track) {
  track.stop();
});
firestore.collection("calls").doc(callI2duu).delete().then(() => {
    console.log("Document successfully deleted!");
}).catch((error) => {
    console.error("Error removing document: ", error);
});
}

window.addEventListener('beforeunload', leaveChannel)

camBtn.ondblclick = async () =>{
  if(options.video.facingMode==='user'){
    options.video.facingMode='environment';
  }
  else{
    options.video.facingMode='user'
  }
  localStream2 = await navigator.mediaDevices.getUserMedia(options);
  const newVideoTrack = localStream2.getVideoTracks()[0];
  if(newVideoTrack.kind !== 'video'){
    console.log(newVideoTrack.kind)
  }
  pc.getSenders().forEach(async s => {
    if(s.track && s.track.kind==='video'){
      await s.replaceTrack(newVideoTrack)
    }
  });
  webcamVideo.srcObject = localStream2;
}