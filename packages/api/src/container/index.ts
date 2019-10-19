// @ts-ignore
import * as iots from "io-ts";
import { isLeft } from "fp-ts/lib/Either";
import { Results, Type } from "@huckleberryai/core";
import * as WebAnalytics from "@huckleberryai/web-analytics";
import * as Widget from "@huckleberryai/widget";
import * as DrivenAdapters from "../driven-adapters";
import * as DrivenPorts from "../driven-ports";

type Handler = (event: any) => Promise<Results.T>;

type Names = WebAnalytics.Names | Widget.Names;

export default () => {
  const maybeFireStore = DrivenAdapters.FireStore.C();
  const maybeTwilio = DrivenAdapters.Twilio.C();

  if (isLeft(maybeFireStore)) throw new Error("shit");
  if (isLeft(maybeTwilio)) throw new Error("shit");

  const fireStore = maybeFireStore.right;
  const twilio = maybeTwilio.right;

  const smsClient = DrivenPorts.Send(twilio);
  const webAnalyticsRepository = DrivenPorts.WebAnalyticsRepository(fireStore);
  const widgetSettingsRepository = DrivenPorts.WidgetSettingsRepository(
    fireStore
  );
  const widgetMessageRepository = DrivenPorts.WidgetMessageRepository(
    fireStore
  );

  return new Map<Names | Type.T, Handler>([
    [
      WebAnalytics.Client.UseCases.Loaded.Event.Name,
      WebAnalytics.Client.UseCases.Loaded.Handler(webAnalyticsRepository),
    ],
    [
      WebAnalytics.Client.UseCases.Unloaded.Event.Name,
      WebAnalytics.Client.UseCases.Unloaded.Handler(webAnalyticsRepository),
    ],
    [
      WebAnalytics.Server.UseCases.HTTPAccess.Event.Name,
      WebAnalytics.Server.UseCases.HTTPAccess.Handler(webAnalyticsRepository),
    ],
    [
      Widget.Message.UseCases.AddName.Command.Name,
      Widget.Message.UseCases.AddName.Handler(widgetMessageRepository),
    ],
    [
      Widget.Message.UseCases.AddText.Command.Name,
      Widget.Message.UseCases.AddText.Handler(widgetMessageRepository),
    ],
    [
      Widget.Message.UseCases.AddPhone.Command.Name,
      Widget.Message.UseCases.AddPhone.Handler(widgetMessageRepository),
    ],
    [
      Widget.Message.UseCases.Create.Command.Name,
      Widget.Message.UseCases.Create.Handler(widgetMessageRepository),
    ],
    [
      Widget.Message.UseCases.Send.Command.Name,
      Widget.Message.UseCases.Send.Handler(
        widgetSettingsRepository,
        widgetMessageRepository,
        smsClient
      ),
    ],
    [
      Widget.Settings.UseCases.GetByID.Query.Name,
      Widget.Settings.UseCases.GetByID.Handler(widgetSettingsRepository),
    ],
  ]);
};
