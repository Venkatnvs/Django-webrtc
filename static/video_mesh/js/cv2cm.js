function openCvReady() {
cv['onRuntimeInitialized']=()=>{
      // do all your work here
let video = document.getElementById('local_stream');
let cv2_canvs = document.getElementById("cv2_canvs"); 
let src = new cv.Mat(video.height, video.width, cv.CV_8UC4);
let dst = new cv.Mat(video.height, video.width, cv.CV_8UC1);
let cap = new cv.VideoCapture(video);

const FPS = 30;
function processVideo() {
    try {
        if (!video) {
            // clean and stop.
            src.delete();
            dst.delete();
            return;
        }
        let begin = Date.now();
        // start processing.
        cap.read(src);
        cv.cvtColor(src, dst, cv.COLOR_RGBA2GRAY);
        cv.imshow('cv2_canvs', dst);
        // schedule the next one.
        let delay = 1000/FPS - (Date.now() - begin);
        setTimeout(processVideo, delay);
    } catch (err) {
        console.log(err);
    }
};

// schedule the first one.
setTimeout(processVideo, 0);

};
}