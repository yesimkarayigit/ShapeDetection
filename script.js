const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');
const video = document.createElement('video');
const constraints = { video: true, audio: false };

const mediaStream =  navigator.mediaDevices.getUserMedia(constraints)
  .then(localMediaStream => {
    video.srcObject = localMediaStream;
    video.autoplay = true;
    video.onloadedmetadata = () => {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
    };
  })
  .catch(err => {
    console.error(`OH NO!!!`, err);
  });

const faceDetector = new FaceDetector({fastMode: true});

let facesList = [];

function detectFace() {

  context.strokeStyle = '#ffeb3b';
  context.fillStyle = '#ffeb3b';
  context.font = '30px Mononoki';
  context.lineWidth = 5;

  faceDetector.detect(video)
  .then((faces) => {
    facesList = faces;
  })
  .catch((e) => {
    console.error(e);
  })
}

let animationID;

function rendering() {
  
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.drawImage(video, 0, 0, canvas.width, canvas.height);

  facesList.forEach(face => {
    const { top, left, width, height } = face.boundingBox;
    context.beginPath();
    context.rect(left, top, width, height);
    context.stroke();
    context.fillText('face', left + 1, top - 6);

    if(face.landmarks) {
      face.landmarks.forEach( (landmark) => {
        if(landmark.type === 'eye') {
          context.beginPath();
          context.fill();
          context.fillText("🌸", landmark.locations[0].x, landmark.locations[0].y);
        } else {
          context.beginPath();
          context.fill();
          context.fillText("🔥", landmark.locations[0].x, landmark.locations[0].y);
        }
      })
    }
  })
  animationID = requestAnimationFrame(rendering);
}

let intervalID;

function detection() {
  cancelAnimationFrame(animationID);
  rendering();
  clearInterval(intervalID);
  intervalID = setInterval(detectFace, 100);
}

video.addEventListener('play', detection);