import * as iots from "io-ts";
import * as CreateMessage from "./create-message";
import * as GetByID from "./get-by-id";
export { CreateMessage, GetByID };

export type Names =
  | typeof CreateMessage.Command.Name
  | typeof CreateMessage.Event.Name
  | typeof GetByID.Query.Name;

export const Codecs = new Map<Names, iots.Mixed>([
  [CreateMessage.Command.Name, CreateMessage.Command.Codec],
  [CreateMessage.Event.Name, CreateMessage.Event.Codec],
  [GetByID.Query.Name, GetByID.Query.Codec],
]);
