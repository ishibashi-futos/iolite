"use strict;"

const talks = {
  peerId: "",
  srcId: "",
  peer: undefined,
  localStream: null,
}
window.onload = () => {
  const video = document.querySelector("#video");
  navigator.mediaDevices.getUserMedia({video: true, audio: true}).then((localStream) => {
    video.srcObject = localStream;
    talks.localStream = localStream;
  }).catch((err) => {
    alert(err);
  });
};

/**
 * 宛先のPeerIdを取得する
 */
const getDestinationPeerId = () => {
  return document.querySelector("#destPeerId").value;
}

/**
 * PeerServerに新規接続する.
 */
const connect = () => {
  close();
  const peerId = String(Math.floor(Math.random() * 900) + 100);
  talks.peerId = peerId;
  const peer = new Peer(peerId, {host: "localhost", port: 9000});
  talks.peer = peer;
  peer.on("open", (id) => {
    talks.srcId = id
    document.querySelector("#myPeerId").value = id;
  });
  // 他の端末からの接続要求に対する処理
  const recieve = (call) => {
    call.answer(localStream);
    call.on("stream", (remoteStream) => {
      const video = document.createElement("video");
      video.srcObject = remoteStream;
      document.querySelector("#remoteMedia").appendChild(video);
    });
  }
  peer.on("call", recieve);
}

const close = () => {
  if (talks.peer === null) return;
  try {
    talks.peer.destroy();
  } catch(e) {
    console.log(e);
  }
}

const onSend = () => {
  if (talks.peer === null) return;
  // 他の端末に対する接続要求処理
  const call = peer.call(getDestinationPeerId(), localStream);
  call.on("stream", (remoteStream) => {
    const video = document.createElement("video");
    video.srcObject = remoteStream;
    document.querySelector("#remoteMedia").appendChild(video);
  });
}