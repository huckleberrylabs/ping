import React from "react";
import { RouteComponentProps } from "react-router";
import { useMachine } from "@xstate/react";

// Stripe
import {
  injectStripe,
  Elements,
  ReactStripeElements,
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
import { CreateWidgetForm } from "../../widget/create-form";

// Domain
import { RegisterAccountMachine } from "./machine";
import { Widget } from "@huckleberrylabs/ping";
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
        <CreateWidgetForm
          {...props}
          disabled={false}
          title="create my ping."
          showBackButton={false}
          forwardButtonLabel="activate"
          forwardButtonIcon={"keyboard_arrow_right"}
          onSubmit={(widget) => send({ type: "CREATE_WIDGET", value: widget })}
        />
      ) : current.matches("createAccount") || current.matches("registering") ? (
        <CreateAccount
          {...props}
          onSubmit={(value) =>
            send({
              type: "REGISTER_ACCOUNT",
              value,
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
        <div id="registration-complete">
          {/* The id above is used for conversion tracking */}
          <h1>
            welcome to ping {"   "}
            <span role="img" aria-label="rocket ship">
              🚀
            </span>
          </h1>
          <p>below is your widget code.</p>
          <WidgetCodeSnippet id={(current.context.widget as Widget.T).id} />
          <div className="register-account-login-button">
            <Link to="/login">
              <Button raised icon="keyboard_arrow_right">
                login
              </Button>
            </Link>
          </div>
          <br />
          <br />
          <br />
        </div>
      ) : current.matches("error") ? (
        <div>There was an error, please try again later.</div>
      ) : (
        <div>this should never Happen</div>
      )}
      <LinearProgress
        className="register-account-progress"
        progress={current.context.stage / 4}
      />
    </div>
  );
};

const WithStripe = injectStripe(RegisterAccountInner);

export const RegisterAccountForm = (props: Props) => (
  <Elements>{<WithStripe {...props} />}</Elements>
);
