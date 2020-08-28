import { isLeft } from "fp-ts/lib/Either";
import twilio from "twilio";
import { createClient } from "redis";

// Express
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import helmet from "helmet";

import {
  StatusCode,
  IAM,
  Messaging,
  Widget,
  Email,
  SMS,
  Customers,
  Billing,
  Env,
  Logging,
  NameSpaceCaseString,
} from "@huckleberrylabs/ping-core";
import * as Adapters from "../../adapters";

export const Name = "adapter:http" as NameSpaceCaseString.T;

export const C = () => {
  const maybeFireStore = Adapters.FireStore.C();
  const maybeSendGrid = Adapters.SendGrid.C();
  const maybeStripe = Adapters.Stripe.C();
  const maybeTwilio = Adapters.Twilio.C();
  const eventBus = Adapters.EventBus.C();

  if (
    isLeft(maybeFireStore) ||
    isLeft(maybeSendGrid) ||
    isLeft(maybeStripe) ||
    isLeft(maybeTwilio)
  )
    throw new Error();

  const fireStore = maybeFireStore.right;
  const sendGrid = maybeSendGrid.right;
  const stripe = maybeStripe.right;
  const twilioClient = maybeTwilio.right;
  const redis = createClient();

  // IAM
  const iamAccountRepo = IAM.Account.Repository.C(fireStore);
  const iamAccessPolicyRepo = IAM.Authorization.Repository.C(redis);
  const iamInvalidTokenRepo = IAM.Authentication.Repository.C(redis);
  const iamAuthorizationService = IAM.Authorization.Service.C(
    iamAccessPolicyRepo
  );
  const iamAuthenticationServiceMaybe = IAM.Authentication.Service.C(
    iamInvalidTokenRepo
  );
  if (isLeft(iamAuthenticationServiceMaybe)) throw new Error();
  const iamAuthenticationService = iamAuthenticationServiceMaybe.right;

  // Widget
  const widgetSettingsRepo = Widget.Settings.Repository.C(fireStore);
  const widgetAnalyticsRepo = Widget.Analytics.Repository.C(fireStore);

  // SMS
  const smsNumberRepo = SMS.Number.Repository.C(redis);
  const smsNumberPairingRepo = SMS.NumberPairing.Repository.C(redis);
  const smsService = SMS.Service.C(
    twilioClient,
    smsNumberRepo,
    smsNumberPairingRepo
  );

  // Email
  const emailService = Email.Service.C(sendGrid);

  // Messaging
  const messagingChannelRepo = Messaging.Channel.Repository.C(fireStore);
  const messagingContactRepo = Messaging.Contact.Repository.C(fireStore);
  const messagingConversationRepo = Messaging.Conversation.Repository.C(
    fireStore
  );
  const messagingMessageRepo = Messaging.Message.Repository.C(fireStore);
  const messagingRouterRepo = Messaging.Router.Repository.C(fireStore);
  const messagingService = Messaging.Service.C(
    messagingMessageRepo,
    messagingConversationRepo,
    messagingContactRepo,
    messagingChannelRepo,
    messagingRouterRepo,
    smsService
  );

  // Billing
  const billingService = Billing.Service.C(stripe);

  const app = express();

  app.use(
    express.json({
      type: ["*/json", "text/plain"],
    })
  );
  app.use(bodyParser.urlencoded({ extended: false }));

  // Security
  app.use(helmet());
  app.use(cookieParser());
  app.use(
    cors({
      origin: (origin, callback) => {
        callback(null, true);
      },
      credentials: true,
    })
  );

  // Logging
  app.use(Logging.UseCases.Log.Route, Logging.UseCases.Log.Controller());

  // Health
  app.get("/ping", (req, res) => {
    res.status(StatusCode.OK).send(null);
  });

  /*  IAM */

  app.use(
    IAM.Authentication.UseCases.Authenticate.Route,
    IAM.Authentication.UseCases.Authenticate.Controller(
      iamAuthenticationService
    )
  );

  app.post(
    IAM.Authentication.UseCases.GetAccountIDByCookie.Route,
    IAM.Authentication.UseCases.GetAccountIDByCookie.Controller()
  );

  app.post(
    IAM.Authentication.UseCases.LoginWithToken.Route,
    IAM.Authentication.UseCases.LoginWithToken.Controller(
      iamAuthenticationService,
      IAM.Authentication.UseCases.LoginWithToken.Handler(
        iamAuthenticationService,
        eventBus
      )
    )
  );

  app.post(
    IAM.Authentication.UseCases.Logout.Route,
    IAM.Authentication.UseCases.Logout.Controller()
  );

  app.post(
    IAM.Authentication.UseCases.SendLoginEmail.Route,
    IAM.Authentication.UseCases.SendLoginEmail.Controller(
      IAM.Authentication.UseCases.SendLoginEmail.Handler(
        iamAccountRepo,
        emailService,
        iamAuthenticationService
      )
    )
  );

  app.post(
    IAM.Authentication.UseCases.Test.Route,
    IAM.Authentication.UseCases.Test.Controller()
  );

  app.post(
    IAM.Account.UseCases.GetByID.Route,
    IAM.Account.UseCases.GetByID.Controller(
      iamAuthorizationService,
      IAM.Account.UseCases.GetByID.Handler(iamAccountRepo)
    )
  );

  app.post(
    IAM.Account.UseCases.Update.Route,
    IAM.Account.UseCases.Update.Controller(
      iamAuthorizationService,
      IAM.Account.UseCases.Update.Handler(iamAccountRepo, eventBus)
    )
  );

  /* MESSAGING */

  app.post(
    Messaging.Router.UseCases.Create.Route,
    Messaging.Router.UseCases.Create.Controller(
      iamAuthorizationService,
      Messaging.Router.UseCases.Create.Handler(
        messagingRouterRepo,
        iamAuthorizationService
      )
    )
  );

  app.post(
    Messaging.Router.UseCases.GetByID.Route,
    Messaging.Router.UseCases.GetByID.Controller(
      iamAuthorizationService,
      Messaging.Router.UseCases.GetByID.Handler(messagingRouterRepo)
    )
  );

  app.post(
    Messaging.Router.UseCases.Update.Route,
    Messaging.Router.UseCases.Update.Controller(
      iamAuthorizationService,
      Messaging.Router.UseCases.Update.Handler(messagingRouterRepo)
    )
  );

  app.post(
    Messaging.Contact.UseCases.Create.Route,
    Messaging.Contact.UseCases.Create.Controller(
      iamAuthorizationService,
      Messaging.Contact.UseCases.Create.Handler(
        messagingContactRepo,
        iamAuthorizationService
      )
    )
  );

  app.post(
    Messaging.Contact.UseCases.GetByID.Route,
    Messaging.Contact.UseCases.GetByID.Controller(
      iamAuthorizationService,
      Messaging.Contact.UseCases.GetByID.Handler(messagingContactRepo)
    )
  );

  app.post(
    Messaging.Contact.UseCases.GetByAccount.Route,
    Messaging.Contact.UseCases.GetByAccount.Controller(
      iamAuthorizationService,
      Messaging.Contact.UseCases.GetByAccount.Handler(messagingContactRepo)
    )
  );

  app.post(
    Messaging.Contact.UseCases.Update.Route,
    Messaging.Contact.UseCases.Update.Controller(
      iamAuthorizationService,
      Messaging.Contact.UseCases.Update.Handler(messagingContactRepo)
    )
  );

  app.post(
    Messaging.Conversation.UseCases.GetByAccount.Route,
    Messaging.Conversation.UseCases.GetByAccount.Controller(
      iamAuthorizationService,
      Messaging.Conversation.UseCases.GetByAccount.Handler(
        messagingConversationRepo
      )
    )
  );

  app.post(
    Messaging.Message.UseCases.GetByAccount.Route,
    Messaging.Message.UseCases.GetByAccount.Controller(
      iamAuthorizationService,
      Messaging.Message.UseCases.GetByAccount.Handler(messagingMessageRepo)
    )
  );

  /*  WIDGET */

  app.post(
    Widget.Analytics.UseCases.AddEvent.Route,
    Widget.Analytics.UseCases.AddEvent.Controller(
      Widget.Analytics.UseCases.AddEvent.Handler(widgetAnalyticsRepo)
    )
  );

  app.post(
    Widget.Analytics.UseCases.GetByWidget.Route,
    Widget.Analytics.UseCases.GetByWidget.Controller(
      iamAuthorizationService,
      Widget.Analytics.UseCases.GetByWidget.Handler(widgetAnalyticsRepo)
    )
  );

  app.post(
    Widget.Settings.UseCases.Create.Route,
    Widget.Settings.UseCases.Create.Controller(
      iamAuthorizationService,
      Widget.Settings.UseCases.Create.Handler(
        widgetSettingsRepo,
        iamAuthorizationService,
        messagingService
      )
    )
  );

  app.post(
    Widget.Settings.UseCases.GetByID.Route,
    Widget.Settings.UseCases.GetByID.Controller(
      Widget.Settings.UseCases.GetByID.Handler(widgetSettingsRepo)
    )
  );

  app.post(
    Widget.Settings.UseCases.GetByAccount.Route,
    Widget.Settings.UseCases.GetByAccount.Controller(
      iamAuthorizationService,
      Widget.Settings.UseCases.GetByAccount.Handler(widgetSettingsRepo)
    )
  );

  app.post(
    Widget.Settings.UseCases.Update.Route,
    Widget.Settings.UseCases.Update.Controller(
      iamAuthorizationService,
      Widget.Settings.UseCases.Update.Handler(widgetSettingsRepo)
    )
  );

  app.post(
    Widget.Settings.UseCases.Delete.Route,
    Widget.Settings.UseCases.Delete.Controller(
      iamAuthorizationService,
      Widget.Settings.UseCases.Delete.Handler(widgetSettingsRepo)
    )
  );

  app.post(
    Widget.Channel.UseCases.Receive.Route,
    Widget.Channel.UseCases.Receive.Controller(
      Widget.Channel.UseCases.Receive.Handler(
        widgetSettingsRepo,
        messagingService
      )
    )
  );

  /* SMS */
  app.post(
    SMS.UseCases.Receive.Route,
    Env.Get() === "production"
      ? twilio.webhook()
      : (req, res, next) => {
          next();
        },
    SMS.UseCases.Receive.Controller(
      SMS.UseCases.Receive.Handler(
        smsNumberPairingRepo,
        messagingContactRepo,
        messagingChannelRepo,
        messagingService
      )
    )
  );

  /* CUSTOMERS */

  app.post(
    Customers.UseCases.Register.Route,
    Customers.UseCases.Register.Controller(
      Customers.UseCases.Register.Handler(
        iamAccountRepo,
        widgetSettingsRepo,
        messagingContactRepo,
        messagingRouterRepo,
        messagingService,
        billingService,
        iamAuthorizationService
      )
    )
  );

  app.post(
    Customers.UseCases.Deregister.Route,
    Customers.UseCases.Deregister.Controller(
      iamAuthorizationService,
      Customers.UseCases.Deregister.Handler(
        iamAccountRepo,
        widgetSettingsRepo,
        messagingConversationRepo,
        messagingContactRepo,
        messagingRouterRepo,
        messagingMessageRepo,
        messagingChannelRepo,
        billingService
      )
    )
  );

  return app;
};
