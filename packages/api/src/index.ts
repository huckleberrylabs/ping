import fs from "fs";
import https from "https";
import http from "http";
import { Env } from "@huckleberrylabs/core";
import { C } from "./driving-adapters";

const env = Env.Get();

const app = C();

if (env === "development") {
  const server = http.createServer(app);
  //start our server
  server.listen(8000, () => {
    console.log(`server started on ${server.address()}`);
  });
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
  server.listen(443, () => {
    console.log(`server started on ${server.address()}`);
  });
}
