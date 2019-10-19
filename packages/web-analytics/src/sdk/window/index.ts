import { Env } from "@huckleberryai/core";
import { Logging } from "../../client";
import { Logger } from "../../interfaces";

export const AttachToWindow = (log: Logging.Log.T, logger: Logger) => {
  const env = Env.Get();
  const { HUCKLEBERRY } = window as any;
  HUCKLEBERRY.ENV = env;
  HUCKLEBERRY.log = log;
  logger("info", `ENV: ${env}`, ["web-analytics"]);
};
