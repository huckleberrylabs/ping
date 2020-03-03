import * as iots from "io-ts";
import * as Event from "./event";
import * as Level from "./level";
import * as Log from "./log";
import * as Logger from "./logger";

export type Names = typeof Event.Name | typeof Level.Name | typeof Log.Name;

export const Codecs = new Map<Names, iots.Mixed>([
  [Event.Name, Event.Codec],
  [Level.Name, Level.Codec],
  [Log.Name, Log.Codec],
]);

export { Event, Level, Log, Logger };
