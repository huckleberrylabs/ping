import { isLeft } from "fp-ts/lib/Either";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import morgan from "morgan";
import {
  StatusCode,
  Auth,
  Account,
  Widget,
  Email,
  SMS,
  Billing,
} from "@huckleberrylabs/ping-core";
import * as Adapters from "../../adapters";

export const C = () => {
  const maybeFireStore = Adapters.FireStore.C();
  const maybeSendGrid = Adapters.SendGrid.C();
  const maybeStripe = Adapters.Stripe.C();
  const maybeTwilio = Adapters.Twilio.C();

  if (isLeft(maybeFireStore)) throw new Error("firestore credentials missing");
  if (isLeft(maybeSendGrid)) throw new Error("sendgrid credentials missing");
  if (isLeft(maybeStripe)) throw new Error("stripe credentials missing");
  if (isLeft(maybeTwilio)) throw new Error("twilio credentials missing");

  const fireStore = maybeFireStore.right;
  const sendGrid = maybeSendGrid.right;
  const stripe = maybeStripe.right;
  const twilio = maybeTwilio.right;
  const redis = Adapters.RedisMock.C();

  const smsService = SMS.Service.C(twilio);
  const emailService = Email.Service.C(sendGrid);
  const billingService = Billing.Service.C(stripe, smsService, emailService);

  const accountRepository = Account.Repository.C(fireStore);
  const analyticsRepository = Widget.Analytics.Repository.C(fireStore);

  const invalidTokenRepository = Auth.Token.Repository.C(redis);

  const maybeAuthenticationService = Auth.AuthenticationService.default(
    invalidTokenRepository
  );
  if (isLeft(maybeAuthenticationService))
    throw new Error("twilio credentials missing");
  const authenticationService = maybeAuthenticationService.right;

  const app = express();

  app.use(
    express.json({
      type: ["*/json", "text/plain"],
    })
  );

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

  /*  AUTH */

  app.use(
    Auth.UseCases.Authenticate.Route,
    Auth.UseCases.Authenticate.Controller(authenticationService)
  );

  app.post(
    Auth.UseCases.LoginWithToken.Route,
    Auth.UseCases.LoginWithToken.Controller(
      authenticationService,
      Auth.UseCases.LoginWithToken.Handler(authenticationService)
    )
  );

  app.post(
    Auth.UseCases.Logout.Route,
    Auth.UseCases.Logout.Controller(Auth.UseCases.Logout.Handler())
  );

  app.post(
    Auth.UseCases.SendLoginEmail.Route,
    Auth.UseCases.SendLoginEmail.Controller(
      Auth.UseCases.SendLoginEmail.Handler(
        accountRepository,
        emailClient,
        authenticationService
      )
    )
  );

  app.post(Auth.UseCases.Test.Route, Auth.UseCases.Test.Controller());

  /*  ANALYTICS */

  app.post(
    Analytics.UseCases.AddField.Route,
    Analytics.UseCases.AddField.Controller(
      Analytics.UseCases.AddField.Handler(analyticsRepository)
    )
  );

  app.post(
    Analytics.UseCases.Close.Route,
    Analytics.UseCases.Close.Controller(
      Analytics.UseCases.Close.Handler(analyticsRepository)
    )
  );

  app.post(
    Analytics.UseCases.Load.Route,
    Analytics.UseCases.Load.Controller(
      Analytics.UseCases.Load.Handler(analyticsRepository)
    )
  );

  app.post(
    Analytics.UseCases.Open.Route,
    Analytics.UseCases.Open.Controller(
      Analytics.UseCases.Open.Handler(analyticsRepository)
    )
  );
  app.post(
    Analytics.UseCases.Unload.Route,
    Analytics.UseCases.Unload.Controller(
      Analytics.UseCases.Unload.Handler(analyticsRepository)
    )
  );

  /* ACCOUNT */

  app.post(
    Account.UseCases.GetByID.Route,
    Account.UseCases.GetByID.Controller(
      Account.UseCases.GetByID.Handler(accountRepository)
    )
  );

  app.post(
    Account.UseCases.Register.Route,
    Account.UseCases.Register.Controller(
      Account.UseCases.Register.Handler(accountRepository, billingService)
    )
  );

  app.post(
    Account.UseCases.Update.Route,
    Account.UseCases.Update.Controller(
      Account.UseCases.Update.Handler(accountRepository)
    )
  );

  /*  WIDGET */

  app.post(
    Widget.UseCases.GetByID.Route,
    Widget.UseCases.GetByID.Controller(
      Widget.UseCases.GetByID.Handler(widgetRepository)
    )
  );

  app.post(
    Widget.UseCases.Create.Route,
    Widget.UseCases.Create.Controller(
      Widget.UseCases.Create.Handler(widgetRepository)
    )
  );

  app.post(
    Widget.UseCases.Update.Route,
    Widget.UseCases.Update.Controller(
      Widget.UseCases.Update.Handler(widgetRepository)
    )
  );

  return app;
};
