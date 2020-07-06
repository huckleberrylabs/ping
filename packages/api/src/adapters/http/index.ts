import { isLeft } from "fp-ts/lib/Either";
// import twilio from "twilio";
import { createClient } from "redis";

// Express
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import helmet from "helmet";
import morgan from "morgan";

import {
  StatusCode,
  IAM,
  Messaging,
  Widget,
  Email,
  SMS,
} from "@huckleberrylabs/ping-core";
import * as Adapters from "../../adapters";

export const C = () => {
  const maybeFireStore = Adapters.FireStore.C();
  const maybeSendGrid = Adapters.SendGrid.C();
  const maybeStripe = Adapters.Stripe.C();
  const maybeTwilio = Adapters.Twilio.C();
  const eventBus = Adapters.EventBus.C();

  if (isLeft(maybeFireStore)) throw new Error("firestore credentials missing");
  if (isLeft(maybeSendGrid)) throw new Error("sendgrid credentials missing");
  if (isLeft(maybeStripe)) throw new Error("stripe credentials missing");
  if (isLeft(maybeTwilio)) throw new Error("twilio credentials missing");

  const fireStore = maybeFireStore.right;
  const sendGrid = maybeSendGrid.right;
  // const stripe = maybeStripe.right;
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
  if (isLeft(iamAuthenticationServiceMaybe))
    throw new Error("Secret Key Missing");
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
  // const billingService = Billing.Service.C(stripe, smsService, emailService);

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
  app.use(cors());

  // Logging
  app.use(morgan("tiny"));

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
    IAM.Account.UseCases.Register.Route,
    IAM.Account.UseCases.Register.Controller(
      IAM.Account.UseCases.Register.Handler(
        iamAccountRepo,
        iamAuthorizationService,
        eventBus
      )
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
    Messaging.Contact.UseCases.Update.Route,
    Messaging.Contact.UseCases.Update.Controller(
      iamAuthorizationService,
      Messaging.Contact.UseCases.Update.Handler(messagingContactRepo)
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
    Widget.Settings.UseCases.Update.Route,
    Widget.Settings.UseCases.Update.Controller(
      iamAuthorizationService,
      Widget.Settings.UseCases.Update.Handler(widgetSettingsRepo)
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
    // twilio.webhook(), // TODO enable only in production
    SMS.UseCases.Receive.Controller(
      SMS.UseCases.Receive.Handler(
        smsNumberPairingRepo,
        messagingContactRepo,
        messagingChannelRepo,
        messagingService
      )
    )
  );

  return app;
};
