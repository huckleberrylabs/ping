import * as CreateMessage from "./create-message";
import * as GetByID from "./get-by-id";
export { CreateMessage, GetByID };

export type Names =
  | typeof CreateMessage.Command.Name
  | typeof CreateMessage.Event.Name
  | typeof GetByID.Query.Name;
