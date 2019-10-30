import * as iots from "io-ts";
import * as Entity from "./entity";
import * as UseCases from "./use-cases";
export { UseCases };
export * from "./entity";

export type Names = typeof Entity.Name | UseCases.Names;

export const Codecs = new Map<Names, iots.Mixed>([
  [Entity.Name, Entity.Codec],
  [UseCases.AddWidget.Command.Name, UseCases.AddWidget.Command.Codec],
  [UseCases.AddWidget.Event.Name, UseCases.AddWidget.Event.Codec],
  [UseCases.UpdateWidget.Command.Name, UseCases.UpdateWidget.Command.Codec],
  [UseCases.UpdateWidget.Event.Name, UseCases.UpdateWidget.Event.Codec],
  [UseCases.Update.Command.Name, UseCases.Update.Command.Codec],
  [UseCases.Update.Event.Name, UseCases.Update.Event.Codec],
  [UseCases.GetByID.Query.Name, UseCases.GetByID.Query.Codec],
]);