import React from "react";
import { RouteComponentProps } from "react-router";
import { useMachine } from "@xstate/react";

// Stripe
import {
  injectStripe,
  Elements,
  ReactStripeElements
} from "react-stripe-elements";

// Button
import { Button } from "@rmwc/button";
import "@material/button/dist/mdc.button.css";

// Progress Bar
import { LinearProgress } from "@rmwc/linear-progress";
import "@material/linear-progress/dist/mdc.linear-progress.css";

// Loading
import { CircularProgress } from "@rmwc/circular-progress";
import "@rmwc/circular-progress/circular-progress.css";

import "./style.css";

import { WidgetCodeSnippet } from "../../widget/code-snippet";
import { CreateWidget } from "../../widget/create";

// Domain
import { RegisterAccountMachine } from "./machine";
import { Widget } from "@huckleberryai/ping";
import { CreateAccount } from "../create";
import { Link } from "react-router-dom";

type Props = RouteComponentProps & {
  stripe: ReactStripeElements.StripeProps;
};

export const RegisterAccountInner = (props: Props) => {
  const [current, send] = useMachine(RegisterAccountMachine(props.stripe));
  return (
    <div className="register-account-container">
      {current.matches("createWidget") ? (
        <CreateWidget
          {...props}
          disabled={false}
          title="Create Your Widget"
          showBackButton={false}
          submitButtonText="Activate"
          submitButtonIcon={"keyboard_arrow_right"}
          onSubmit={widget => send({ type: "CREATE_WIDGET", value: widget })}
        />
      ) : current.matches("createAccount") || current.matches("registering") ? (
        <CreateAccount
          {...props}
          onSubmit={value =>
            send({
              type: "REGISTER_ACCOUNT",
              value
            })
          }
          onBack={() => send({ type: "BACK" })}
          submitButtonIcon={
            current.matches("createAccount") ? (
              "keyboard_arrow_right"
            ) : (
              <CircularProgress />
            )
          }
          disabled={current.matches("registering")}
          submitButtonText={
            current.matches("createAccount") ? "Activate" : "Loading"
          }
        />
      ) : current.matches("success") ? (
        <div>
          <h1>
            Welcome to Ping {"  "}
            <span role="img" aria-label="rocket ship">
              🚀
            </span>
          </h1>
          <p>Below is your website code!</p>
          <WidgetCodeSnippet id={(current.context.widget as Widget.T).id} />
          <div className="register-account-login-button">
            <Link to="/login">
              <Button
                raised
                className="create-widget-submit-button"
                icon="keyboard_arrow_right"
              >
                Login
              </Button>
            </Link>
          </div>
          <br />
          <br />
          <br />
        </div>
      ) : current.matches("error") ? (
        <div>There was an error, Please try again later.</div>
      ) : (
        <div>This should never Happen</div>
      )}
      <LinearProgress progress={current.context.stage / 4} />
    </div>
  );
};

const WithStripe = injectStripe(RegisterAccountInner);

export const RegisterAccount = (props: Props) => (
  <Elements>{<WithStripe {...props} />}</Elements>
);
