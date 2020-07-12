import WebSocket from "ws";
import { Server } from "http";

export const C = (server: Server) => {
  const wss = new WebSocket.Server({ server });
  wss.on("connection", (ws, request) => {
    if (!request.url) {
      ws.close();
      return;
    }
    console.log(`clients: ${wss.clients.size} `);
    let alive = true;
    const timeout = setTimeout(() => {
      if (alive) {
        ws.ping();
        alive = false;
      } else {
        ws.terminate();
      }
    }, 5000 + 1000);

    ws.on("error", () => {
      console.log("ws error");
      timeout.refresh();
      alive = true;
    });
    ws.on("message", async message => {
      console.log("ws message");
      timeout.refresh();
      alive = true;
      const data = JSON.parse(message.toString());
      console.log(data);
    });
    ws.on("ping", () => {
      console.log("ws ping");
      timeout.refresh();
      alive = true;
    });
    ws.on("pong", () => {
      console.log("ws pong");
      timeout.refresh();
      alive = true;
    });
    ws.on("unexpected-response", () => {
      console.log("ws unexpected-response");
      timeout.refresh();
      alive = true;
    });
    ws.on("upgrade", () => {
      console.log("ws upgrade");
      timeout.refresh();
      alive = true;
    });
    ws.on("close", () => {
      console.log(`clients: ${wss.clients.size} `);
      console.log("ws close");
      clearTimeout(timeout);
    });
  });
};
