import * as AddWidget from "./add-widget";
import * as SendLoginEmail from "./send-login-email";
import * as Update from "./update";
import * as UpdateWidget from "./update-widget";
import * as GetByID from "./get-by-id";
import * as LoginWithToken from "./login-with-token";
import * as Logout from "./logout";
export {
  AddWidget,
  LoginWithToken,
  Logout,
  SendLoginEmail,
  Update,
  UpdateWidget,
  GetByID,
};

export type Names =
  | typeof AddWidget.Command.Name
  | typeof AddWidget.Event.Name
  | typeof Logout.Command.Name
  | typeof Logout.Event.Name
  | typeof LoginWithToken.Command.Name
  | typeof LoginWithToken.Event.Name
  | typeof SendLoginEmail.Command.Name
  | typeof SendLoginEmail.Event.Name
  | typeof UpdateWidget.Command.Name
  | typeof UpdateWidget.Event.Name
  | typeof Update.Command.Name
  | typeof Update.Event.Name
  | typeof GetByID.Query.Name;
