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


let faces = [];

function detection() {
  
  const faceDetector = new FaceDetector({fastMode: true});

  function detectFace() {

    faceDetector.detect(video)
    .then((faces) => {
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      faces.forEach(face => {    
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
    })
    .catch((e) => {
      console.error('ops!');
    })
  }

  function rendering() {

    context.strokeStyle = '#ffeb3b';
    context.fillStyle = '#ffeb3b';
    context.font = '30px Mononoki';
    context.lineWidth = 5;

    faces;

    requestAnimationFrame(rendering);
  }

  rendering();
  setInterval(detectFace, 100);
}

video.addEventListener('play', detection); 