let video = document.getElementById("video");
let model;
let canvas = document.getElementById("canvas"); 
let ctx = canvas.getContext("2d");

const setupCamera = () => {
  return navigator.mediaDevices
    .getUserMedia({
      video: { width: 600, height: 400 }, audio: false,
    })
    .then((stream) => {
      video.srcObject = stream;
    });
};

const detectFaces = async () => { // Properly declare the function as async
  const prediction = await model.estimateFaces(video, false);

  console.log(prediction);

  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  prediction.forEach((face) => {
    ctx.strokeStyle = "green";
    ctx.lineWidth = 2;
    ctx.strokeRect(face.topLeft[0], face.topLeft[1], face.bottomRight[0] - face.topLeft[0], face.bottomRight[1] - face.topLeft[1]);
  });

  prediction.forEach((pred) => {
   ctx.beginPath();
   ctx.lineWidth = "4";
   ctx.strokeStyle = "blue";
   ctx.rect(
     pred.topLeft[0],
     pred.topLeft[1],
     pred.bottomRight[0] - pred.topLeft[0],
     pred. bottomRight [1] - pred.topLeft [1]
   );
   ctx.stroke();

   clx.fillStyle = "red";
   pred.landmarks.forEach(landmark => {
    ctx.fillRect(landmark[0], landmark[1], 5, 5);
   })
});
};

const main = async () => { // Place the async function here
  await setupCamera(); // Wait for the camera to be set up
  model = await blazeface.load(); // Wait for the model to load
  detectFaces(); // Call detectFaces after everything is ready
};

setupCamera ();
video.addEventListener ("loadeddata", async () => {
model = await blazeface. load();
setInterval(detectFaces, 40);
});

main();