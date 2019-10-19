import { Option, some, none } from "fp-ts/lib/Option";

// https://github.com/diafygi/webrtc-ips
export const Detect = async (): Promise<Option<string>> => {
  let RTCPeerConnection = window.RTCPeerConnection;
  if (!RTCPeerConnection) {
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    // @ts-ignore
    iframe.sandbox = "allow-same-origin";
    document.body.appendChild(iframe);
    const win = iframe.contentWindow;
    if (win)
      // @ts-ignore
      RTCPeerConnection = win.RTCPeerConnection;
  }

  const peerConnection: RTCPeerConnection = new RTCPeerConnection({
    iceServers: [{ urls: "stun:stun.services.mozilla.com" }],
  });
  peerConnection.createDataChannel("");
  const description = await peerConnection.createOffer();
  await peerConnection.setLocalDescription(description);
  if (peerConnection.localDescription) {
    const lines = peerConnection.localDescription.sdp.split("\n");
    const IPAddresses = lines
      .filter(line => line.indexOf("a=candidate:") === 0)
      .map(line => {
        // match just the IP address
        const IPRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/;
        const match = IPRegex.exec(line);
        if (match) {
          return match[1];
        }
        return undefined;
      });
    if (IPAddresses[0]) return some(IPAddresses[0]);
  }
  return none;
};
