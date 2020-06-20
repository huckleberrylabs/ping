import fs from "fs";
import https from "https";
import http, { Server } from "http";
import { Env } from "@huckleberrylabs/ping-core";
import { HTTP } from "./adapters";

const env = Env.Get();

const app = HTTP.C();

const logPort = (server: Server) =>
  console.log(`server started on ${server.address()?.toString()}`);

if (env === "development") {
  const server = http.createServer(app);
  server.listen(8000, () => logPort(server));
} else if (env === "production") {
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
  const server = https.createServer(credentials, app);
  server.listen(443, () => logPort(server));
}
