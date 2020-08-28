import * as Env from "../values/env";
import * as Log from "./log";
import * as UseCases from "./use-cases";
import { C, DecodeErrorFormatter } from "./logger";

export const Logger = C(Log.C(), Env.Get());
export { UseCases, DecodeErrorFormatter };
