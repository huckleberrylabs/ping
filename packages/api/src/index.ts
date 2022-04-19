import http, { Server } from "http";
import { Logger } from "@huckleberrylabs/ping-core";
import { HTTP, WSS } from "./adapters";

const app = HTTP.C();

let server: Server;
let port: number;

server = http.createServer(app);
port = 8000;
server.listen(port, () =>
  Logger(HTTP.Name, "info", `server started on ${port}`)
);
WSS.C(server);
