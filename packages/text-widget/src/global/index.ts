import { CONTEXT_ID, ENV, RUNTIME, UUID } from "@huckleberryai/core";

let GLOBAL: { [key: string]: any } = ((<any>window).Huckleberry = {});

const ORIGIN_ID = UUID("c857c895-40b7-41ca-ae27-a04e34274298");

GLOBAL.CONTEXT_ID = CONTEXT_ID;
log.add(`CONTEXT_ID: ${CONTEXT_ID}`, ["info", "core"], ORIGIN_ID);
GLOBAL.ENV = ENV;
log.add(`ENV: ${ENV}`, ["info", "core"], ORIGIN_ID);
GLOBAL.RUNTIME = RUNTIME;
log.add(`RUNTIME: ${RUNTIME}`, ["info", "core"], ORIGIN_ID);
GLOBAL.log = log;

export { GLOBAL };
