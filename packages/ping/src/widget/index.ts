import * as iots from "io-ts";
import * as UseCases from "./use-cases";
import * as Entity from "./entity";
export { UseCases };
export * from "./entity";

export type Names = typeof Entity.Name | UseCases.Names;

export const Codecs = new Map<Names, iots.Mixed>([
  [Entity.Name, Entity.Codec],
  [UseCases.CreateMessage.Command.Name, UseCases.CreateMessage.Command.Codec],
  [UseCases.CreateMessage.Event.Name, UseCases.CreateMessage.Event.Codec],
  [UseCases.GetByID.Query.Name, UseCases.GetByID.Query.Codec],
]);
