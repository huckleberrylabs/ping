import * as AddWidget from "./add-widget";
import * as GetByID from "./get-by-id";
export { AddWidget, GetByID };

export type Names =
  | typeof AddWidget.Command.Name
  | typeof AddWidget.Event.Name
  | typeof GetByID.Query.Name;
