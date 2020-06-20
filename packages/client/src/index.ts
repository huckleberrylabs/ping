import { isLeft } from "fp-ts/lib/Either";
import { Config, Logging } from "@huckleberrylabs/ping-core";
import * as SDK from "./sdk";
import * as Widget from "./widget";

export const onLoad = async () => {
  const idMaybe = Widget.GetID(Config.InsertScriptID);
  if (isLeft(idMaybe)) return;
  const id = idMaybe.right;
  const sdk = SDK.C(id);
  sdk.Analytics.Load();
  window.addEventListener("unload", sdk.Analytics.Unload);
  const settingsMaybe = await sdk.Widget.GetByID();
  if (isLeft(settingsMaybe)) return;
  const settings = settingsMaybe.right;
  const log = Logging.Log.C();
  const logger = Logging.Logger.C(log);
  if (settings.enabled) Widget.C(logger, sdk)(settings);
};

window.addEventListener("load", onLoad, false);
