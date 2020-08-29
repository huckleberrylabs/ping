import WebSocket from "ws";
import { Server } from "http";
import { Logger, NameSpaceCaseString } from "@huckleberrylabs/ping-core";

export const Name = "adapters:websocket" as NameSpaceCaseString.T;

export const C = (server: Server) => {
  const wss = new WebSocket.Server({ server });
  wss.on("connection", (ws, request) => {
    if (!request.url) {
      ws.close();
      return;
    }
    Logger(Name, "info", `ws ${wss.clients.size} client`);
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
      Logger(Name, "info", "ws error");
      timeout.refresh();
      alive = true;
    });
    ws.on("message", async message => {
      Logger(Name, "info", "ws message");
      timeout.refresh();
      alive = true;
      const data = JSON.parse(message.toString());
      console.log(data);
    });
    ws.on("ping", () => {
      Logger(Name, "info", "ws ping");
      timeout.refresh();
      alive = true;
    });
    ws.on("pong", () => {
      Logger(Name, "info", "ws pong");
      timeout.refresh();
      alive = true;
    });
    ws.on("unexpected-response", () => {
      Logger(Name, "info", "ws unexpected-response");
      timeout.refresh();
      alive = true;
    });
    ws.on("upgrade", () => {
      Logger(Name, "info", "ws upgrade");
      timeout.refresh();
      alive = true;
    });
    ws.on("close", () => {
      Logger(Name, "info", "ws close");
      Logger(Name, "info", `ws ${wss.clients.size} client`);
      clearTimeout(timeout);
    });
  });
};
