import { isLeft, isRight } from "fp-ts/lib/Either";
import { UUID } from "@huckleberryai/core";
import { SDK as AnalyticsSDK } from "@huckleberryai/web-analytics";
import { PublicSDK, Config } from "@huckleberryai/ping";
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
  const settingsMaybe = await widgetSDK.Widget.Get();
  if (isLeft(settingsMaybe)) return;
  const settings = settingsMaybe.right;
  if (settings.enabled) Widget.C(analytics.log, widgetSDK)(settings);
};

window.addEventListener("load", onLoad, false);
