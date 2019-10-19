import * as iots from "io-ts";
import * as FingerPrint from "./fingerprint";
import * as Logging from "./logging";
import * as UseCases from "./use-cases";

export type Names = typeof FingerPrint.Name | Logging.Names | UseCases.Names;

export const Codecs = new Map([
  ...Array.from(
    new Map<typeof FingerPrint.Name, iots.Mixed>([
      [FingerPrint.Name, FingerPrint.Codec],
    ]).entries()
  ),
  ...Array.from(Logging.Codecs.entries()),
  ...Array.from(UseCases.Codecs.entries()),
]);

export { FingerPrint, Logging, UseCases };
