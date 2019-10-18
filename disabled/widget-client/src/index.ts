import { UUID } from "@huckleberryai/core";
import WebAnalytics from "@huckleberryai/web-analytics";
import Widget from "@huckleberryai/widget";
import { GetWidgetID } from "./widget";
import { InitializeWidget } from "./widget";

const INSERT_SCRIPT_ID = "huckleberry-text-insert-script";

export const onLoad = () => {
  // Get Widget ID
  const corr = UUID.C();
  const id = GetWidgetID(INSERT_SCRIPT_ID);

  // Client Loaded Event, Set Unload Listener, Check API online
  const analytics = WebAnalytics.SDK(id, corr);

  // const parent = LoadedEvent.id

  const settings = Widget.SDK.Settings.Get(id, corr);
  if (!settings.disabled) {
    InitializeWidget(analytics.log)(settings, corr);
  }
};

window.addEventListener("load", onLoad, false);
