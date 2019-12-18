const image = document.getElementById('image');
const button = document.querySelector('button');
const section = document.querySelector('section');

const video = document.querySelector('.video-player');
const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');


function getVideo() {
  navigator.mediaDevices.getUserMedia({ video: true, audio: false })
  .then(localMediaStream => {
    video.srcObject = localMediaStream;
    video.play();
  })
  .catch(err => {
    console.error(`OH NO!!!`, err);
  });
}



function detect() {
  const width = video.videoWidth;
  const height = video.videoHeight;
    canvas.width = width;
    canvas.height = height;

    context.clearRect(0, 0, width, height);

    context.drawImage(video, 0, 0, width, height);


    context.strokeStyle = '#ffeb3b';
    context.fillStyle = '#ffeb3b';
    context.font = '16px Mononoki';
    context.lineWidth = 5;
  
  console.log('yeap!');
  var faceDetector = new FaceDetector();

  faceDetector.detect(video)
    .then(faces => faces.forEach(face => {
      let arrayFromLandmarks = face.landmarks;
      section.innerHTML = arrayFromLandmarks.map(landmark => {
          return `<p>${landmark.type}</p>`;
      }).join('')
      console.log(face);
      
      const { top, left, width, height } = face.boundingBox;
      context.beginPath();
      context.rect(left, top, width, height);
      context.stroke();
      context.fillText('face detected', left + 5, top - 8);
      }) 
    )
    .catch((e) => {
      console.error('ops!');
    })
}

getVideo();
button.addEventListener('click', detect);