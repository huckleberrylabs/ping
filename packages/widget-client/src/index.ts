import { isLeft, isRight } from "fp-ts/lib/Either";
import { UUID } from "@huckleberryai/core";
import { SDK as AnalyticsSDK } from "@huckleberryai/web-analytics";
import { SDK as WidgetSDK } from "@huckleberryai/widget";
import * as Widget from "./widget";

const INSERT_SCRIPT_ID = "huckleberry-text-insert-script";

export const onLoad = async () => {
  const corr = UUID.C();
  const maybeID = Widget.GetID(INSERT_SCRIPT_ID);
  const id = isRight(maybeID) ? maybeID.right : undefined;

  const analytics = AnalyticsSDK.C()(id, corr);

  if (!id) return;

  const widgetSDK = WidgetSDK.C(id, corr);
  const settingsMaybe = await widgetSDK.Settings.Get();

  if (isLeft(settingsMaybe)) return;

  const settings = settingsMaybe.right;
  if (settings.enabled) Widget.C(analytics.log, widgetSDK)(settings);
};

window.addEventListener("load", onLoad, false);