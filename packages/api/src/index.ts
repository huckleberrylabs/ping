import express from "express";
import awsServerlessExpress from "aws-serverless-express";
import { Env } from "@huckleberryai/core";
import { http as handler } from "./driving-adapters";

const app = express();
app.get("/", handler);
const server = awsServerlessExpress.createServer(app);
const env = Env.Get();

if (env === "development") {
  app.listen(8000, () => console.log(`Example app listening on port ${8000}!`));
}

exports.handler = (event: any, context: any) => {
  awsServerlessExpress.proxy(server, event, context);
};
