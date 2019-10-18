import * as iots from "io-ts";
import * as Loaded from "./loaded";
import * as Unloaded from "./unloaded";

export type Names =
  | typeof Loaded.Event.Name
  | typeof Unloaded.Command.Name
  | typeof Unloaded.Event.Name;

export const Codecs = new Map<Names, iots.Mixed>([
  [Loaded.Event.Name, Loaded.Event.Codec],
  [Unloaded.Command.Name, Unloaded.Command.Codec],
  [Unloaded.Event.Name, Unloaded.Event.Codec],
]);

export { Loaded, Unloaded };
