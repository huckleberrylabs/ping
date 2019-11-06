import * as iots from "io-ts";
import * as AddName from "./add-name";
import * as AddPhone from "./add-phone";
import * as AddText from "./add-text";
import * as Send from "./send";
export { AddName, AddPhone, AddText, Send };

export type Names =
  | typeof AddName.Event.Name
  | typeof AddName.Command.Name
  | typeof AddPhone.Event.Name
  | typeof AddPhone.Command.Name
  | typeof AddText.Event.Name
  | typeof AddText.Command.Name
  | typeof Send.Event.Name
  | typeof Send.Command.Name;

export const Codecs = new Map<Names, iots.Mixed>([
  [AddName.Event.Name, AddName.Event.Codec],
  [AddName.Command.Name, AddName.Command.Codec],
  [AddPhone.Event.Name, AddPhone.Event.Codec],
  [AddPhone.Command.Name, AddPhone.Command.Codec],
  [AddText.Event.Name, AddText.Event.Codec],
  [AddText.Command.Name, AddText.Command.Codec],
  [Send.Event.Name, Send.Event.Codec],
  [Send.Command.Name, Send.Command.Codec],
]);
