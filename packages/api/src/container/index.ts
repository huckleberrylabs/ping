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
  const maybeSendGrid = DrivenAdapters.SendGrid.C();
  const maybeStripe = DrivenAdapters.Stripe.C();
  const maybeTwilio = DrivenAdapters.Twilio.C();

  if (isLeft(maybeFireStore)) throw new Error("firestore credentials missing");
  if (isLeft(maybeSendGrid)) throw new Error("sendgrid credentials missing");
  if (isLeft(maybeStripe)) throw new Error("stripe credentials missing");
  if (isLeft(maybeTwilio)) throw new Error("twilio credentials missing");

  const fireStore = maybeFireStore.right;
  const sendGrid = maybeSendGrid.right;
  const stripe = maybeStripe.right;
  const twilio = maybeTwilio.right;

  const smsClient = DrivenPorts.SMSClient.C(twilio);
  const emailClient = DrivenPorts.EmailClient.C(sendGrid);
  const billingService = DrivenPorts.BillingService.C(
    stripe,
    smsClient,
    emailClient
  );

  const iamServiceMaybe = DrivenPorts.IAMService.C();
  if (isLeft(iamServiceMaybe)) throw new Error("iam private key missing");
  const iamService = iamServiceMaybe.right;

  const analyticsRepository = DrivenPorts.WebAnalyticsRepository.C(fireStore);
  const accountRepository = DrivenPorts.AccountRepository.C(fireStore);
  const widgetRepository = DrivenPorts.WidgetRepository.C(fireStore);
  const messageRepository = DrivenPorts.MessageRepository.C(fireStore);

  return new Map<Names | Type.T, Handler>([
    [
      WebAnalytics.Client.UseCases.Loaded.Event.Name,
      WebAnalytics.Client.UseCases.Loaded.Handler(analyticsRepository),
    ],
    [
      WebAnalytics.Client.UseCases.Unloaded.Event.Name,
      WebAnalytics.Client.UseCases.Unloaded.Handler(analyticsRepository),
    ],
    [
      WebAnalytics.Server.UseCases.HTTPAccess.Event.Name,
      WebAnalytics.Server.UseCases.HTTPAccess.Handler(analyticsRepository),
    ],
    [
      Ping.UseCases.RegisterAccount.Command.Name,
      Ping.UseCases.RegisterAccount.Handler(
        accountRepository,
        billingService,
        emailClient
      ),
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
      Ping.Account.UseCases.UpdateWidget.Command.Name,
      Ping.Account.UseCases.UpdateWidget.Handler(
        accountRepository,
        widgetRepository
      ),
    ],
    [
      Ping.Account.UseCases.Update.Command.Name,
      Ping.Account.UseCases.Update.Handler(accountRepository),
    ],
    [
      Ping.Account.UseCases.SendLoginEmail.Command.Name,
      Ping.Account.UseCases.SendLoginEmail.Handler(
        accountRepository,
        emailClient,
        iamService
      ),
    ],
    [
      Ping.Account.UseCases.LoginWithToken.Command.Name,
      Ping.Account.UseCases.LoginWithToken.Handler(
        accountRepository,
        iamService
      ),
    ],
    [
      Ping.Account.UseCases.Logout.Command.Name,
      Ping.Account.UseCases.Logout.Handler(accountRepository),
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
