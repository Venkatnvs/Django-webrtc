// Get access to webcam stream
navigator.mediaDevices.getUserMedia({ video: true })
    .then(function(stream) {
        var videoElement = document.getElementById('videoElement');
        var filteredVideoElement = document.getElementById('filteredVideoElement');
        videoElement.srcObject = stream;
        console.log(stream)
        let remoteStream = new MediaStream();
        filteredVideoElement.srcObject = remoteStream;

        // Create canvas and context
        var canvasElement = document.getElementById('canvasElement');
        var canvasContext = canvasElement.getContext('2d',{willReadFrequently:true});

        // Get filtered video element

        // Process video frames and apply grayscale filter
        function processVideoFrame() {
            canvasContext.drawImage(videoElement, 0, 0, videoElement.videoWidth||videoElement.offsetWidth, videoElement.videoHeight||videoElement.offsetHeight);

            // Apply grayscale filter
            var imageData = canvasContext.getImageData(0, 0, videoElement.videoWidth||videoElement.offsetWidth, videoElement.videoHeight||videoElement.offsetHeight);
            var data = imageData.data;

            for (var i = 0; i < data.length; i += 4) {
                var brightness = (data[i] + data[i + 1] + data[i + 2]) / 3;
                data[i] = brightness; // Red
                data[i + 1] = brightness; // Green
                data[i + 2] = brightness; // Blue
            }

            canvasContext.putImageData(imageData, 0, 0);

            // Draw processed frames to filtered video element
            const stream1= canvasElement.captureStream();
            // return;
            stream1.getTracks().forEach((track) => {
              remoteStream.addTrack(track);
            });
            // filteredVideoElement.srcObject = stream1;

            // Call processVideoFrame recursively to continuously process frames
            requestAnimationFrame(processVideoFrame);
        }

        // Start processing video frames
        processVideoFrame();
    })
    .catch(function(error) {
        console.error('Error accessing webcam:', error);
    });
