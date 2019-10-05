import { Either, isLeft } from "fp-ts/lib/Either";
import { GetContext, GetENV, GetRuntime } from "@huckleberryai/core";
import { LOG, log } from "../log";

export const GetGlobal = (): Either<Error, { [key: string]: any }> => {
  const context = GetContext();
  const env = GetENV();
  const runtime = GetRuntime();
  const ORIGIN_ID = "c857c895-40b7-41ca-ae27-a04e34274298";
  const { HUCKLEBERRY } = runtime === "browser" ? (window as any) : global;
  HUCKLEBERRY.CONTEXT_ID = context;
  HUCKLEBERRY.ENV = env;
  HUCKLEBERRY.RUNTIME = runtime;
  log(`CONTEXT_ID: ${context}`, ["info", "core"], ORIGIN_ID);
  log(`ENV: ${env}`, ["info", "core"], ORIGIN_ID);
  log(`RUNTIME: ${runtime}`, ["info", "core"], ORIGIN_ID);
  HUCKLEBERRY.log = LOG;
  return HUCKLEBERRY;
};

export const GLOBAL = {}; // GetGlobal();
