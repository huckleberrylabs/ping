import { isLeft } from "fp-ts/lib/Either";
import { Results, Type } from "@huckleberryai/core";
import * as WebAnalytics from "@huckleberryai/web-analytics";
import * as Ping from "@huckleberryai/ping";
import * as DrivenAdapters from "../driven-adapters";
import * as DrivenPorts from "../driven-ports";

type Handler = (event: any) => Promise<Results.T>;

type Names = WebAnalytics.Names | Ping.Names;

export default () => {
  const maybeFireStore = DrivenAdapters.FireStore.C();
  const maybeTwilio = DrivenAdapters.Twilio.C();

  if (isLeft(maybeFireStore)) throw new Error("firestore credentials missing");
  if (isLeft(maybeTwilio)) throw new Error("twilio credentials missing");

  const fireStore = maybeFireStore.right;
  const twilio = maybeTwilio.right;

  const smsClient = DrivenPorts.Send(twilio);
  const webAnalyticsRepository = DrivenPorts.WebAnalyticsRepository.C(
    fireStore
  );

  const accountRepository = DrivenPorts.AccountRepository.C(fireStore);
  const widgetRepository = DrivenPorts.WidgetRepository.C(fireStore);
  const messageRepository = DrivenPorts.MessageRepository.C(fireStore);

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
      Ping.UseCases.RegisterAccount.Command.Name,
      Ping.UseCases.RegisterAccount.Handler(accountRepository),
    ],
    [
      Ping.Account.UseCases.GetByID.Query.Name,
      Ping.Account.UseCases.GetByID.Handler(accountRepository),
    ],
    [
      Ping.Account.UseCases.AddWidget.Command.Name,
      Ping.Account.UseCases.AddWidget.Handler(
        accountRepository,
        widgetRepository
      ),
    ],
    [
      Ping.Widget.UseCases.CreateMessage.Command.Name,
      Ping.Widget.UseCases.CreateMessage.Handler(messageRepository),
    ],
    [
      Ping.Widget.UseCases.GetByID.Query.Name,
      Ping.Widget.UseCases.GetByID.Handler(widgetRepository),
    ],
    [
      Ping.Message.UseCases.AddName.Command.Name,
      Ping.Message.UseCases.AddName.Handler(messageRepository),
    ],
    [
      Ping.Message.UseCases.AddText.Command.Name,
      Ping.Message.UseCases.AddText.Handler(messageRepository),
    ],
    [
      Ping.Message.UseCases.AddPhone.Command.Name,
      Ping.Message.UseCases.AddPhone.Handler(messageRepository),
    ],
    [
      Ping.Message.UseCases.Send.Command.Name,
      Ping.Message.UseCases.Send.Handler(
        widgetRepository,
        messageRepository,
        smsClient
      ),
    ],
  ]);
};
