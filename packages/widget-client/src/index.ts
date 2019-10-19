import { isLeft } from "fp-ts/lib/Either";
import { UUID } from "@huckleberryai/core";
import { SDK as AnalyticsSDK } from "@huckleberryai/web-analytics";
import { SDK as WidgetSDK } from "@huckleberryai/widget";
import * as Widget from "./widget";

const INSERT_SCRIPT_ID = "huckleberry-text-insert-script";

export const onLoad = async () => {
  // Get Widget ID
  const corr = UUID.C();
  const maybeID = Widget.GetID(INSERT_SCRIPT_ID);
  if (isLeft(maybeID)) throw new Error();
  const id = maybeID.right;

  // Client Loaded Event, Set Unload Listener, Check API online
  const analyticsMaybe = await AnalyticsSDK()(id, corr);
  if (isLeft(analyticsMaybe)) throw new Error();
  const analytics = analyticsMaybe.right;

  const widgetSDK = await WidgetSDK(id, corr);

  const settingsMaybe = await widgetSDK.Settings.GetByID();
  if (isLeft(settingsMaybe)) throw new Error();
  const settings = settingsMaybe.right;

  if (settings.enabled) Widget.C(analytics.log, widgetSDK)(settings);
};

window.addEventListener("load", onLoad, false);
