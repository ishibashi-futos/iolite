// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
window.onload = (e: any): void => {
  const video = document.querySelector("video");
  navigator.mediaDevices.getUserMedia({video: true, audio: false}).then((mediaStrean) => {
    video.srcObject = mediaStrean;
//    video.play();
  }).catch((err) => {
    alert(err);
  });
};
