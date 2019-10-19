import * as Env from "./env";
import * as Errors from "./errors";
import * as Event from "./event";
import * as HTTP from "./http";
export * from "./interfaces";
import * as Json from "./json";
import * as Result from "./result";
import * as Results from "./results";
import * as Runtime from "./runtime";
import * as Values from "./values";
export * from "./values";

export type Names = Errors.Names | Results.Names | Values.Names;

export const Codecs = new Map([
  ...Array.from(Errors.Codecs.entries()),
  ...Array.from(Results.Codecs.entries()),
  ...Array.from(Values.Codecs.entries()),
]);

export { Env, Errors, Event, HTTP, Json, Result, Results, Runtime };
