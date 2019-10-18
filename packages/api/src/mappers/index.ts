import * as iots from "io-ts";
import WebAnalytics from "@huckleberryai/web-analytics";

const map: { [key: string]: undefined | iots.Mixed } = {
  [WebAnalytics.Client.UseCases.Loaded.Event.Name]:
    WebAnalytics.Client.UseCases.Loaded.Event.Codec,
  [WebAnalytics.Client.UseCases.Unloaded.Event.Name]:
    WebAnalytics.Client.UseCases.Unloaded.Event.Codec,
  [WebAnalytics.Server.UseCases.HTTPAccess.Event.Name]:
    WebAnalytics.Server.UseCases.HTTPAccess.Event.Codec,
};

export default map;
