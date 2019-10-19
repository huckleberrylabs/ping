import * as iots from "io-ts";
import * as UseCases from "./use-cases";
import * as Entity from "./entity";
export * from "./entity";
export { UseCases };

export type Names = typeof UseCases.GetByID.Query.Name | typeof Entity.Name;

export const Codecs = new Map<Names, iots.Mixed>([
  [UseCases.GetByID.Query.Name, UseCases.GetByID.Query.Codec],
  [Entity.Name, Entity.Codec],
]);
