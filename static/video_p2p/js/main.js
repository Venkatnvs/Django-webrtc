const startButton = document.getElementById('startButton');
navigator.mediaDevices.getUserMedia({ video: true, audio: false })
  .then(stream => {
    const localVideo = document.getElementById('localVideo');
    localVideo.srcObject = stream;
  })
  .catch(error => {
    console.error('Error accessing media devices:', error);
  });

// Initialize WebRTC variables
let localStream;
let remoteStream;
let localPeerConnection;
let remotePeerConnection;

// Start the call
console.log(startButton)
startButton.addEventListener('click', startCall);

// Hang up the call
const hangupButton = document.getElementById('hangupButton');
hangupButton.addEventListener('click', hangupCall);

function startCall() {
  // Create local peer connection
  localPeerConnection = new RTCPeerConnection();

  // Add local media stream to the connection
  localStream = document.getElementById('localVideo').srcObject;
  localStream.getTracks().forEach(track => {
    localPeerConnection.addTrack(track, localStream);
  });

  // Create remote peer connection
  remotePeerConnection = new RTCPeerConnection();

  // Add remote media stream to the connection
  remotePeerConnection.ontrack = event => {
    remoteStream = event.streams[0];
    document.getElementById('remoteVideo').srcObject = remoteStream;
  };

  // Exchange ICE candidates between peers
  localPeerConnection.onicecandidate = event => {
    if (event.candidate) {
      remotePeerConnection.addIceCandidate(event.candidate)
        .catch(error => {
          console.error('Error adding ice candidate:', error);
        });
    }
  };

  remotePeerConnection.onicecandidate = event => {
    if (event.candidate) {
      localPeerConnection.addIceCandidate(event.candidate)
        .catch(error => {
          console.error('Error adding ice candidate:', error);
        });
    }
  };

  // Create offer and set local description
  localPeerConnection.createOffer()
    .then(offer => {
      return localPeerConnection.setLocalDescription(offer);
    })
    .then(() => {
      // Exchange SDP offer and answer between peers
      remotePeerConnection.setRemoteDescription(localPeerConnection.localDescription)
        .then(() => {
          return remotePeerConnection.createAnswer();
        })
        .then(answer => {
          return remotePeerConnection.setLocalDescription(answer);
        })
        .then(() => {
          localPeerConnection.setRemoteDescription(remotePeerConnection.localDescription);
        })
        .catch(error => {
          console.error('Error creating or setting offer/answer:', error);
        });
    })
    .catch(error => {
      console.error('Error creating or setting local description:', error);
    });
}

function hangupCall() {
  // Close peer connections
  localPeerConnection.close();
  remotePeerConnection.close();

  // Stop media streams
  localStream.getTracks().forEach(track => {
    track.stop();
  });
  remoteStream.getTracks().forEach(track => {
    track.stop();
  });

  // Reset video elements
  document.getElementById('localVideo').srcObject = null;
  document.getElementById('remoteVideo').srcObject = null;
}
