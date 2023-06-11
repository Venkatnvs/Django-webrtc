const grayBtn = document.getElementById("convertGray");
const outVdo = document.getElementById("outputVd")
const canvas = document.getElementById('outputCa');
let width, height;
let src, dst, cap;
let grayScale = new MediaStream();

if (window.orientation == 0) {
  //portrait
  width = 480; height = 640;
}
else {
  //landscape
  width = 640; height = 480;
}

grayBtn.onclick = async () => {
  outVdo.width = width;
  outVdo.height = height;
  canvas.width = width;
  canvas.height = height;
  outVdo.srcObject = localStream;
  localcamVideo.srcObject = null
  localcamVideo.srcObject = grayScale;
  cvtGray()
};



function cvtGray() {
  src = new cv.Mat(height, width, cv.CV_8UC4);
  dst = new cv.Mat(height, width, cv.CV_8UC1);
  cap = new cv.VideoCapture("outputVd");
  setTimeout(process, 33);
}

function process() {
  cap.read(src);
  cv.cvtColor(src, dst, cv.COLOR_RGBA2GRAY);
  cv.imshow("outputCa", dst);
  setTimeout(process, 33);
}

canvas.onplay = () =>{
  const stream1= canvas.captureStream();
  stream1.getTracks().forEach((track) => {
    grayScale.addTrack(track);
  });
}