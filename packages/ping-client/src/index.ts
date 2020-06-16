import { isLeft, isRight } from "fp-ts/lib/Either";
import { UUID } from "@huckleberrylabs/core";
import { PublicSDK, AnalyticsSDK, Config } from "@huckleberrylabs/ping";
import * as SDK from "./sdk";
import * as Widget from "./widget";

export const onLoad = async () => {
  const corr = UUID.C();
  const maybeID = Widget.GetID(Config.InsertScriptID);
  const id = isRight(maybeID) ? maybeID.right : undefined;
  const analytics = AnalyticsSDK.C({
    fingerPrint: { enabled: false },
    setUnloadListener: false,
  })(id, corr);
  if (!id) return;
  const widgetSDK = PublicSDK.C(id, corr);
  const sdk2 = SDK.C(id);
  const settingsMaybe = await widgetSDK.Widget.Get();
  if (isLeft(settingsMaybe)) return;
  const settings = settingsMaybe.right;
  if (settings.enabled) Widget.C(analytics.log, widgetSDK, sdk2)(settings);
};

window.addEventListener("load", onLoad, false);
