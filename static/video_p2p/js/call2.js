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
let localStream = null;
let remoteStream = null;

// HTML elements

// const screenshareButton = document.getElementById('screenshareButton');
const webcamVideo = document.getElementById('user-1');
// const callButton = document.getElementById('callButton');
const callInput = document.getElementById('callInput');
// const answerButton = document.getElementById('answerButton');
const remoteVideo = document.getElementById('user-2');
// const hangupButton = document.getElementById('hangupButton');

// 1. Setup media sources
// screenshareButton.onclick = async () =>{
//   webcamButton.disabled=true;
//   increatemed('screen');
// }


let increatemed = async (data) => {
  if(data == 'screen'){
    localStream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
  }
  else{
    localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
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
  // callButton.disabled = false;
  // answerButton.disabled = false;
  // webcamButton.disabled = true;
  // screenshareButton.disabled=true;

};

// 2. Create an offer
let createofferFun = async () => {
  // Reference Firestore collections for signaling
  const callDoc = firestore.collection('calls').doc();
  const offerCandidates = callDoc.collection('offerCandidates');
  const answerCandidates = callDoc.collection('answerCandidates');

  callInput.value = callDoc.id;
  console.log(callDoc.id)

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
let answerButtoncl = async (unid) => {
  const callId = unid
  const callDoc = firestore.collection('calls').doc(callId);
  const answerCandidates = callDoc.collection('answerCandidates');
  const offerCandidates = callDoc.collection('offerCandidates');
  remoteVideo.style.display='block';
  remoteVideo.classList.add('smallFrame');
  pc.onicecandidate = (event) => {
    event.candidate && answerCandidates.add(event.candidate.toJSON());
  };

  const callData = (await callDoc.get()).data();

  const offerDescription = callData.offer;
  await pc.setRemoteDescription(new RTCSessionDescription(offerDescription));

  const answerDescription = await pc.createAnswer();
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

let toggleMic = async () => {
  let audioTrack = localStream.getTracks().find(track => track.kind === 'audio')

  if(audioTrack.enabled){
      audioTrack.enabled = false
      document.getElementById('mic-btn').style.backgroundColor = 'rgb(255, 80, 80)'
  }else{
      audioTrack.enabled = true
      document.getElementById('mic-btn').style.backgroundColor = 'rgb(179, 102, 249, .9)'
  }
}

let toggleCamera = async () => {
  let videoTrack = localStream.getTracks().find(track => track.kind === 'video')

  if(videoTrack.enabled){
      videoTrack.enabled = false
      document.getElementById('camera-btn').style.backgroundColor = 'rgb(255, 80, 80)'
  }else{
      videoTrack.enabled = true
      document.getElementById('camera-btn').style.backgroundColor = 'rgb(179, 102, 249, .9)'
  }
}


let onloadCamera = async () => {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const callIduu = urlParams.get('id')
  if(callIduu){
    answerButtoncl(callIduu);
    console.log('added')
  }
  else{
    createofferFun()
    console.log('offer')
  }
}
window.addEventListener('load',onloadCamera)
document.getElementById('camera-btn').addEventListener('click', toggleCamera)
document.getElementById('mic-btn').addEventListener('click', toggleMic)

increatemed()