import React, { useState } from "react";
import { RouteComponentProps } from "react-router";
import { useMachine } from "@xstate/react";
import {
  CardElement,
  injectStripe,
  Elements,
  ReactStripeElements
} from "react-stripe-elements";

// Text Field
import { TextField } from "@rmwc/textfield";
import "@material/textfield/dist/mdc.textfield.css";
import "@material/floating-label/dist/mdc.floating-label.css";
import "@material/notched-outline/dist/mdc.notched-outline.css";
import "@material/line-ripple/dist/mdc.line-ripple.css";

// Button
import { Button } from "@rmwc/button";
import "@material/button/dist/mdc.button.css";

// Progress Bar
import { LinearProgress } from "@rmwc/linear-progress";
import "@material/linear-progress/dist/mdc.linear-progress.css";

// Loading
// import { CircularProgress } from "@rmwc/circular-progress";
//import "@rmwc/circular-progress/circular-progress.css";

import "./style.css";

// Domain
import { PersonName, NonEmptyString } from "@huckleberryai/core";
import { CreateWidget } from "../../widget/create";
import { RegisterAccountMachine } from "./machine";
import { isSome } from "fp-ts/lib/Option";

type Props = RouteComponentProps & {
  stripe: ReactStripeElements.StripeProps;
};

const IsValidEmail = (input: unknown) =>
  NonEmptyString.Is(input) && input.indexOf("@") > 0;

const IsValidFirstLastName = (input: unknown) => {
  if (!NonEmptyString.Is(input)) return false;
  const name = PersonName.C(input);
  return isSome(name.first) && isSome(name.last);
};

type CreateAccountProps = Props & {
  onBack: () => void;
  onSubmit: (
    email: NonEmptyString.T,
    userName: PersonName.T,
    paymentMethodID: string,
    accountName?: NonEmptyString.T
  ) => void;
};

const CreateAccount = (props: CreateAccountProps) => {
  const [accountName, setAccountName] = useState<string>();
  const [email, setEmail] = useState<string>();
  const [userName, setUserName] = useState<string>();
  const [card, setCard] = useState<stripe.elements.ElementChangeResponse>();
  return (
    <div className="register-account-create-container">
      <h1>Create Account</h1>
      <TextField
        outlined
        label="Business Name"
        placeholder={"ACME Inc."}
        value={accountName}
        onChange={event =>
          setAccountName((event.target as HTMLInputElement).value)
        }
      />
      <TextField
        outlined
        required
        label="Person's Name"
        value={userName}
        invalid={accountName !== undefined && !IsValidFirstLastName(userName)}
        onChange={event =>
          setUserName((event.target as HTMLInputElement).value)
        }
      />
      <TextField
        outlined
        label="Email"
        required
        value={email}
        placeholder={"email@example.com"}
        invalid={accountName !== undefined && !IsValidEmail(email)}
        onChange={event => setEmail((event.target as HTMLInputElement).value)}
      />
      <CardElement
        hidePostalCode={false}
        placeholderCountry="ca"
        supportedCountries={["ca", "us"]}
        classes={{
          base: "register-account-stripe mdc-ripple-surface"
        }}
        onChange={change => setCard(change)}
      />
      <div className="register-account-create-controls">
        <Button
          className="create-widget-submit-button"
          icon="keyboard_arrow_left"
          onClick={props.onBack}
        >
          Back
        </Button>
        <Button
          raised
          className="create-widget-submit-button"
          icon="keyboard_arrow_right"
          disabled={
            !IsValidFirstLastName(userName) ||
            !IsValidEmail(email) ||
            !card ||
            !card.complete
          }
          onClick={async () => {
            const stripeResponse = await props.stripe.createPaymentMethod(
              "card",
              {
                billing_details: {
                  // Can Also Add Address Object
                  email,
                  name: userName,
                  phone: null
                }
              }
            );
            if (stripeResponse.paymentMethod) {
              props.onSubmit(
                email as NonEmptyString.T,
                PersonName.C(userName as NonEmptyString.T),
                stripeResponse.paymentMethod.id,
                accountName as NonEmptyString.T | undefined
              );
            }
          }}
        >
          Activate
        </Button>
      </div>
    </div>
  );
};

const RegisterAccountInner = (props: Props) => {
  const [current, send] = useMachine(RegisterAccountMachine);
  console.log("current context: ", current.context);
  console.log("current event: ", current.event);

  return (
    <div className="register-account-container">
      {current.matches("createWidget") ? (
        <CreateWidget
          {...props}
          disabled={!current.matches("createWidget")}
          title="Create Your Widget"
          showBackButton={false}
          submitButtonText="Activate"
          submitButtonIcon={"keyboard_arrow_right"}
          onSubmit={widget => send({ type: "NEXT", value: widget })}
        />
      ) : current.matches("createAccount") ? (
        <CreateAccount
          {...props}
          onSubmit={(email, userName, paymentMethodID, accountName) =>
            send({
              type: "CREATE",
              value: { email, userName, paymentMethodID, accountName }
            })
          }
          onBack={() => send({ type: "BACK" })}
        />
      ) : current.matches("accountCreated") ? (
        <div>
          <h1>Welcome to Ping 🚀</h1>
          <p>We've sent you an email with your very own code blah blah blah </p>
          <Button raised className="create-widget-submit-button" icon="close">
            Close
          </Button>
          <br />
          <br />
          <br />
        </div>
      ) : (
        <div>Oh No</div>
      )}
      <LinearProgress progress={current.context.stage / 3} />
    </div>
  );
};

export const RegisterAccountWithStripe = injectStripe(RegisterAccountInner);

export const RegisterAccount = (props: Props) => (
  <Elements>{<RegisterAccountWithStripe {...props} />}</Elements>
);
