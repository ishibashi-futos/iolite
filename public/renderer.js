"use strict;"

window.onload = () => {
  const peer = new Peer();
  const video = document.querySelector("video");
  navigator.mediaDevices.getUserMedia({video: true, audio: true}).then((localStream) => {
    video.srcObject = localStream;
    const call = peer.call("iolite", localStream);
    call.on("stream", (remoteStream) => {
      const anotherMedia = document.createElement("video");
      anotherMedia.srcObject = remoteStream;
      document.querySelector("#remoteMedia").appendChild(anotherMedia);
    });
    peer.on("call", (call) => {
      call.ansewer(localStream);
      call.on("stream", (remoteStream) => {
        const anotherMedia = document.createElement("video");
        anotherMedia.srcObject = remoteStream;
        document.querySelector("#remoteMedia").appendChild(anotherMedia);
      });
    });
  }).catch((err) => {
    alert(err);
  });
};
