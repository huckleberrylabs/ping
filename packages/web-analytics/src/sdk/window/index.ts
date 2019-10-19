import { Env } from "@huckleberryai/core";
import { Logging } from "../../client";
import { Logger } from "../../interfaces";

export const AttachToWindow = (log: Logging.Log.T) => {
  const env = Env.Get();
  window.HUCKLEBERRY.ENV = env;
  window.HUCKLEBERRY.log = log;
};
