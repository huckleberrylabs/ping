import * as iots from "io-ts";
import * as RegisterAccount from "./register-account";
export { RegisterAccount };

export type Names =
  | typeof RegisterAccount.Event.Name
  | typeof RegisterAccount.Command.Name;

export const Codecs = new Map<Names, iots.Mixed>([
  [RegisterAccount.Command.Name, RegisterAccount.Command.Codec],
  [RegisterAccount.Event.Name, RegisterAccount.Event.Codec],
]);
