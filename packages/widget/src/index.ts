// @ts-ignore
import * as iots from "io-ts";
import SDK from "./sdk";
import * as Message from "./message";
import * as Settings from "./settings";
import * as Interfaces from "./interfaces";

export type Names = Message.UseCases.Names | Settings.Names;

export const Codecs = new Map([
  ...Array.from(Message.UseCases.Codecs.entries()),
  ...Array.from(Settings.Codecs.entries()),
]);

export { SDK, Message, Settings, Interfaces };
