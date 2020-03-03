import * as iots from "io-ts";
import * as UseCases from "./use-cases";

export type Names = typeof UseCases.HTTPAccess.Event.Name;

export const Codecs = new Map<Names, iots.Mixed>([
  [UseCases.HTTPAccess.Event.Name, UseCases.HTTPAccess.Event.Codec],
]);

export { UseCases };
