"use strict;"

window.onload = () => {
  const peer = new Peer();
  const video = document.querySelector("video");
  navigator.mediaDevices.getUserMedia({video: true, audio: true}).then((mediaStrean) => {
    video.srcObject = mediaStrean;
    const call = peer.call("iolite", mediaStrean);
    call.on("stream", (remoteStream) => {
      const anotherMedia = document.createElement("video");
      anotherMedia.srcObject = remoteStream;
      document.querySelector("#remoteMedia").appendChild(anotherMedia);
    });
  }).catch((err) => {
    alert(err);
  });
};
