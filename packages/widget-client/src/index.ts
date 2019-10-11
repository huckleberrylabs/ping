import { UUID } from "@huckleberryai/core";
import { WidgetSDK } from "@huckleberryai/widget";
import { WebAnalyticsSDK } from "@huckleberryai/web-analytics";
import { GetWidgetID } from "./widget";
import { InitializeWidget } from "./widget";

const INSERT_SCRIPT_ID = "huckleberry-text-insert-script";

export const onLoad = () => {
  // Get Widget ID
  const corr = UUID();
  const id = GetWidgetID(INSERT_SCRIPT_ID);

  // Client Loaded Event, Set Unload Listener, Check API online
  const analytics = WebAnalyticsSDK()(id, corr);

  // const parent = LoadedEvent.id

  const settings = WidgetSDK.Settings.GetByID(id);
  if (!settings.disabled) {
    InitializeWidget(analytics.log)(settings, corr);
  }
};

window.addEventListener("load", onLoad, false);
