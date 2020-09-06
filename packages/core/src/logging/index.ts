import * as Log from "./log";
import * as UseCases from "./use-cases";
import { C, DecodeErrorFormatter } from "./logger";

export const Logger = C(
  Log.C(),
  process.env.LOGGING_ENABLED === "true" ||
    process.env.REACT_LOGGING_ENABLED === "true"
);
export { UseCases, DecodeErrorFormatter };
