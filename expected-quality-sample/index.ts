import express from "express";
import http from "http";
import bodyParser from "body-parser";
import xmlparser from "express-xml-bodyparser";
import cookieParser from "cookie-parser";
import { router } from "./routes";
import { serverConfig } from "./config";
import { logger } from "./utilities";

const app = express();

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.use(xmlparser());
app.use(cookieParser());

// CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.use("/api", router);

app.use("/static", express.static(serverConfig.publicDir));

const server = http.createServer(app);
server.listen(serverConfig.port, () =>
  logger("info", `API running on localhost:${serverConfig.port}`)
);
