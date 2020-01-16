// @ts-ignore
import * as iots from "io-ts";
import * as Config from "./config";
import * as UseCases from "./use-cases";
import * as Account from "./account";
import * as Widget from "./widget";
import * as Message from "./message";
import * as Interfaces from "./interfaces";
export * from "./sdk";
export { Config, UseCases, Account, Widget, Message, Interfaces };

export type Names =
  | UseCases.Names
  | Account.Names
  | Widget.Names
  | Message.Names;

export const Codecs = new Map([
  ...Array.from(UseCases.Codecs.entries()),
  ...Array.from(Account.Codecs.entries()),
  ...Array.from(Widget.Codecs.entries()),
  ...Array.from(Message.UseCases.Codecs.entries()),
]);
