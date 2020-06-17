import { isLeft } from "fp-ts/lib/Either";
import { UUID } from "@huckleberrylabs/core";
import { PublicSDK, Config, Client } from "@huckleberrylabs/ping";
import * as SDK from "./sdk";
import * as Widget from "./widget";

export const onLoad = async () => {
  const corr = UUID.C();
  const idMaybe = Widget.GetID(Config.InsertScriptID);
  if (isLeft(idMaybe)) return;
  const id = idMaybe.right;
  const widgetSDK = PublicSDK.C(id, corr);
  const sdk2 = SDK.C(id);
  sdk2.Widget.Tracking.Load();
  window.addEventListener("unload", sdk2.Widget.Tracking.Unload); // TODO make sure this triggers on unload consistently
  const settingsMaybe = await widgetSDK.Widget.Get();
  if (isLeft(settingsMaybe)) return;
  const settings = settingsMaybe.right;
  const log = Client.Logging.Log.C();
  const logger = Client.Logging.Logger.C(log, corr); // TODO send Log to Server
  if (settings.enabled) Widget.C(logger, widgetSDK, sdk2)(settings);
};

window.addEventListener("load", onLoad, false);
