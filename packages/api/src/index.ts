import fs from "fs";
import https from "https";
import http, { Server } from "http";
import { Env } from "@huckleberrylabs/ping-core";
import { HTTP, WSS } from "./adapters";

const env = Env.Get();

const app = HTTP.C();

const logPort = (server: Server) =>
  console.log(`server started on ${server.address()?.toString()}`);

let server: Server;
let port: number;
if (env === "production") {
  // TLS Encryption
  const credentials = {
    key: fs.readFileSync(
      "/etc/letsencrypt/live/live.ping.buzz/privkey.pem",
      "utf8"
    ),
    cert: fs.readFileSync(
      "/etc/letsencrypt/live/live.ping.buzz/fullchain.pem",
      "utf8"
    ),
  };
  server = https.createServer(credentials, app);
  port = 443;
} else {
  server = http.createServer(app);
  port = 8000;
}

server.listen(port, () => logPort(server));
WSS.C(server);
