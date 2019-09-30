import { CONTEXT_ID, ENV, RUNTIME } from "@huckleberryai/core";
import { log, LOG } from "../log";

let GLOBAL: { [key: string]: any } = ((<any>window).Huckleberry = {});

const ORIGIN_ID = "c857c895-40b7-41ca-ae27-a04e34274298";

GLOBAL.CONTEXT_ID = CONTEXT_ID;
log(`CONTEXT_ID: ${CONTEXT_ID}`, ["info", "core"], ORIGIN_ID);
GLOBAL.ENV = ENV;
log(`ENV: ${ENV}`, ["info", "core"], ORIGIN_ID);
GLOBAL.RUNTIME = RUNTIME;
log(`RUNTIME: ${RUNTIME}`, ["info", "core"], ORIGIN_ID);
GLOBAL.log = LOG;

export { GLOBAL };
