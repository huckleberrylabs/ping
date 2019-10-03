import { CONTEXT_ID, ENV, RUNTIME } from "@huckleberryai/core";
import { LOG, log } from "../log";

export const getGlobal = () => {
  const ORIGIN_ID = "c857c895-40b7-41ca-ae27-a04e34274298";
  const { HUCKLEBERRY } = RUNTIME === "browser" ? (window as any) : global;
  HUCKLEBERRY.CONTEXT_ID = CONTEXT_ID;
  HUCKLEBERRY.ENV = ENV;
  HUCKLEBERRY.RUNTIME = RUNTIME;
  log(`CONTEXT_ID: ${CONTEXT_ID}`, ["info", "core"], ORIGIN_ID);
  log(`ENV: ${ENV}`, ["info", "core"], ORIGIN_ID);
  log(`RUNTIME: ${RUNTIME}`, ["info", "core"], ORIGIN_ID);
  HUCKLEBERRY.log = LOG;
  return HUCKLEBERRY;
};

export const GLOBAL = {}; // getGlobal();
