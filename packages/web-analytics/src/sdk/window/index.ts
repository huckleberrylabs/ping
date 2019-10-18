import { isLeft, right } from "fp-ts/lib/Either";
import { Env, Runtime } from "@huckleberryai/core";
import { Logging } from "../../client";
import { Logger } from "../../interfaces";

export const AttachToWindow = (log: Logging.Log.T, logger: Logger) => {
  const env = Env.Get();
  const runtime = Runtime.Get();
  if (isLeft(env)) return env;
  if (isLeft(runtime)) return runtime;
  const { HUCKLEBERRY } =
    runtime.right === "browser" ? (window as any) : global;
  HUCKLEBERRY.ENV = env;
  HUCKLEBERRY.RUNTIME = runtime;
  HUCKLEBERRY.log = log;
  logger("info", `ENV: ${env}`, ["web-analytics"]);
  logger("info", `RUNTIME: ${runtime}`, ["web-analytics"]);
  return right(true);
};
