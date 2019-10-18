// @ts-ignore
import * as iots from "io-ts";
import { isLeft } from "fp-ts/lib/Either";
import { Results } from "@huckleberryai/core";
import WebAnalytics from "@huckleberryai/web-analytics";
import * as DrivenAdapters from "../driven-adapters";
import * as DrivenPorts from "../driven-ports";

type Handler = (event: any) => Promise<Results.T>;
export default (): { [key: string]: undefined | Handler } => {
  const maybeFireStore = DrivenAdapters.FireStore.C();
  const maybeTwilio = DrivenAdapters.Twilio.C();

  if (isLeft(maybeFireStore)) throw new Error("shit");
  if (isLeft(maybeTwilio)) throw new Error("shit");

  const fireStore = maybeFireStore.right;
  const twilio = maybeTwilio.right;

  // @ts-ignore
  const smsClient = DrivenPorts.Send(twilio);
  const webAnalyticsRepository = DrivenPorts.WebAnalyticsRepository(fireStore);

  return {
    [WebAnalytics.Client.UseCases.Loaded.Event
      .Name]: WebAnalytics.Client.UseCases.Loaded.Handler(
      webAnalyticsRepository
    ),
    [WebAnalytics.Client.UseCases.Unloaded.Event
      .Name]: WebAnalytics.Client.UseCases.Unloaded.Handler(
      webAnalyticsRepository
    ),
    [WebAnalytics.Server.UseCases.HTTPAccess.Event
      .Name]: WebAnalytics.Server.UseCases.HTTPAccess.Handler(
      webAnalyticsRepository
    ),
  };
};
