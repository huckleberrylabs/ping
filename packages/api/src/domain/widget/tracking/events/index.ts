import iots from "io-ts";
import * as Closed from "./closed";
import * as Loaded from "./loaded";
import * as Opened from "./opened";
import * as Unloaded from "./unloaded";

export type Names =
  | typeof Closed.Name
  | typeof Loaded.Name
  | typeof Opened.Name
  | typeof Unloaded.Name;

export const Codecs = new Map<Names, iots.Mixed>([
  [Closed.Name, Closed.Codec],
  [Loaded.Name, Loaded.Codec],
  [Opened.Name, Opened.Codec],
  [Unloaded.Name, Unloaded.Codec],
]);

export { Closed, Loaded, Opened, Unloaded };
