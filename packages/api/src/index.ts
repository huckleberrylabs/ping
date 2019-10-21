import awsServerlessExpress from "aws-serverless-express";
import { Env } from "@huckleberryai/core";
import { C } from "./driving-adapters";

const env = Env.Get();

const app = C();

if (env === "development") {
  app.listen(8000, () => console.log(`listening on port ${8000}!`));
}

const server = awsServerlessExpress.createServer(app);
exports.handler = (event: any, context: any) => {
  awsServerlessExpress.proxy(server, event, context);
};
