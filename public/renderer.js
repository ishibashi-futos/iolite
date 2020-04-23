"use strict;"

const talks = {
  peerId: "",
  srcId: "",
  peer: undefined,
  localStream: null,
  remoteStreams: new Map()
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

const getPeerConnection = () => {
  return {
    host: document.querySelector("#remotePeerHost").value,
    port: document.querySelector("#remotePeerPort").value
  };
}

/**
 * PeerServerに新規接続する.
 */
const connect = () => {
  close();
  const peerId = String(Math.floor(Math.random() * 900) + 100);
  talks.peerId = peerId;
  const dest = getPeerConnection();
  const peer = new Peer(peerId, {host: dest.host, port: dest.port, key: "iolite"});
  talks.peer = peer;
  peer.on("open", (id) => {
    talks.srcId = id
    document.querySelector("#myPeerId").value = id;
  });
  // 他の端末からの接続要求に対する処理
  const recieve = (call) => {
    call.answer(talks.localStream);
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

const call = () => {
  if (talks.peer === null) {
    alert("peer connectionがありません.");
  }
  const peer = talks.peer;
  const call = peer.call(getDestinationPeerId(), talks.localStream);
  call.on("stream", (remoteStream) => {
    // 複数のremoteStreamが送られてきた場合、画面を複数出さないように変更
    if (talks.remoteStreams.has(remoteStream.id)) return;
    talks.remoteStreams.set(remoteStream.id, remoteStream);
    const remote = document.createElement("div");
    remote.id = remoteStream.id;
    const video = document.createElement("video");
    remote.appendChild(video);
    const removeButton = document.createElement("input");
    removeButton.type = "button";
    removeButton.value = "disconnect"
    removeButton.onclick = () => {
      removeRemoteStream(remoteStream.id);
    }
    remote.appendChild(removeButton);
    video.srcObject = remoteStream;
    document.querySelector("#remoteMedia").appendChild(remote);
    video.play();
  });
}

const removeRemoteStream = (id) => {
  const targetElement = document.querySelector(`#${id}`);
  targetElement.parentNode.removeChild(targetElement);
  talks.remoteStreams.delete(id);
}