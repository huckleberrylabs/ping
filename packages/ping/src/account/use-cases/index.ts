import * as AddWidget from "./add-widget";
import * as UpdateWidget from "./update-widget";
import * as Update from "./update";
import * as GetByID from "./get-by-id";
export { AddWidget, UpdateWidget, Update, GetByID };

export type Names =
  | typeof AddWidget.Command.Name
  | typeof AddWidget.Event.Name
  | typeof UpdateWidget.Command.Name
  | typeof UpdateWidget.Event.Name
  | typeof Update.Command.Name
  | typeof Update.Event.Name
  | typeof GetByID.Query.Name;
