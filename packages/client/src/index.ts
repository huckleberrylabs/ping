import { isLeft } from "fp-ts/lib/Either";
import { Config, UUID } from "@huckleberrylabs/ping-core";
import * as SDK from "./sdk";
import * as WidgetClient from "./widget";

export const onLoad = async () => {
  const idMaybe = WidgetClient.GetID(Config.InsertScriptID);
  if (isLeft(idMaybe)) return;
  const id = idMaybe.right;
  const sdk = SDK.C(id);
  const loadEventID = "57db7116-a386-418a-8e24-e6668f911940" as UUID.T;
  sdk.Analytics.AddEvent(loadEventID);
  window.addEventListener("unload", () => {
    const unloadEventID = "903724c3-47cc-4808-afb2-c5c0f93b5a0a" as UUID.T;
    sdk.Analytics.AddEvent(unloadEventID);
  });
  const settingsMaybe = await sdk.GetByID();
  if (isLeft(settingsMaybe)) return;
  const settings = settingsMaybe.right;
  if (settings.enabled) WidgetClient.C(sdk)(settings);
};

window.addEventListener("load", onLoad, false);
