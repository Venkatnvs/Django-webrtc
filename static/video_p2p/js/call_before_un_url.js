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
      urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'],
    },
  ],
  iceCandidatePoolSize: 10,
};

// Global State
const pc = new RTCPeerConnection(servers);
let localStream;
let remoteStream;
let offerAnsId;

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
  screenshareButton.disabled=true;
  increatemed('web');
}
screenshareButton.onclick = async () =>{
  webcamButton.disabled=true;
  increatemed('screen');
}


let increatemed = async (data) => {
  if(data == 'web'){
    localStream = await navigator.mediaDevices.getUserMedia({ video: true,audio:
      {
      autoGainControl: false,
      channelCount: 2,
      echoCancellation: false,
      latency: 0,
      noiseSuppression: false,
      sampleRate: 48000,
      sampleSize: 16,
      volume: 1.0
    }  });
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
  screenshareButton.disabled=true;
  controlBtn.style.display='flex';
  copyBtn.style.display='flex';
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const callIduu = urlParams.get('m')
  const callI2duu = urlParams.get('id')
  if(callIduu && !callI2duu){
    createCalloffer();
    console.log('added')
  }
  else if(callI2duu && !callIduu){
    answerCallId(callI2duu)
  }
  else{
    alert("Wrong url.Please Try Again");
    location.reload();
    return;
  }
};

// 2. Create an offer
let createCalloffer = async () => {
  // Reference Firestore collections for signaling
  const callDoc = firestore.collection('calls').doc();
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
  location.reload();
}

copyBtn.onclick = async () => {
  const copyUrl = `${window.location.protocol}//${window.location.hostname}${window.location.port}/call/?id=${offerAnsId}`
  console.log(window.location.href.split("?")[0])
  navigator.clipboard.writeText(copyUrl);
  alert("Copied link : " + copyUrl);
}

function dragElement(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  if (document.getElementById(elmnt.id + "header")) {
    // if present, the header is where you move the DIV from:
    document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
  } else {
    // otherwise, move the DIV from anywhere inside the DIV:
    elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
  }

  function closeDragElement() {
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
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

