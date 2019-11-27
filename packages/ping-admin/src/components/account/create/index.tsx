import React, { useState } from "react";
import { isSome } from "fp-ts/lib/Option";
import { RouteComponentProps } from "react-router";

// Stripe
import { CardElement, ReactStripeElements } from "react-stripe-elements";

// Icon
import { IconPropT } from "@rmwc/types";

// Text Field
import { TextField } from "@rmwc/textfield";
import "@material/textfield/dist/mdc.textfield.css";
import "@material/floating-label/dist/mdc.floating-label.css";
import "@material/notched-outline/dist/mdc.notched-outline.css";
import "@material/line-ripple/dist/mdc.line-ripple.css";

// Button
import { Button } from "@rmwc/button";
import "@material/button/dist/mdc.button.css";

// Style
import "./style.css";

// Domain
import { PersonName, NonEmptyString, EmailAddress } from "@huckleberryai/core";

export type CreateAccountFormData = {
  email: EmailAddress.T;
  userName: PersonName.T;
  accountName?: NonEmptyString.T;
};

const IsValidFirstLastName = (input: unknown) => {
  if (!NonEmptyString.Is(input)) return false;
  const name = PersonName.C(input);
  return isSome(name.first) && isSome(name.last);
};

type Props = RouteComponentProps & {
  stripe: ReactStripeElements.StripeProps;
  disabled: boolean;
  submitButtonText: string;
  submitButtonIcon: IconPropT;
  onBack: () => void;
  onSubmit: (form: CreateAccountFormData) => void;
};

export const CreateAccount = (props: Props) => {
  const [accountName, setAccountName] = useState<string>();
  const [email, setEmail] = useState<string>();
  const [userName, setUserName] = useState<string>();
  const [card, setCard] = useState<stripe.elements.ElementChangeResponse>();
  return (
    <div className="create-account-container">
      <h1>create account.</h1>
      <TextField
        outlined
        label="organization"
        placeholder={"jenny's yoga studio"}
        disabled={props.disabled}
        value={accountName}
        onChange={event =>
          setAccountName((event.target as HTMLInputElement).value)
        }
      />
      <TextField
        outlined
        required
        label="name"
        disabled={props.disabled}
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
        disabled={props.disabled}
        value={email}
        placeholder={"email@example.com"}
        invalid={email !== undefined && !EmailAddress.Is(email)}
        onChange={event => setEmail((event.target as HTMLInputElement).value)}
      />
      <p>You will be charged $10 CAD per month.</p>
      <CardElement
        disabled={props.disabled}
        hidePostalCode={false}
        placeholderCountry="ca"
        supportedCountries={["ca", "us"]}
        classes={{
          base: "register-account-stripe mdc-ripple-surface"
        }}
        onChange={change => setCard(change)}
      />
      <div className="create-account-controls">
        <Button
          disabled={props.disabled}
          icon="keyboard_arrow_left"
          onClick={props.onBack}
        >
          Back
        </Button>
        <Button
          raised
          disabled={
            props.disabled ||
            !IsValidFirstLastName(userName) ||
            !EmailAddress.Is(email) ||
            !card ||
            !card.complete
          }
          onClick={() => {
            props.onSubmit({
              email: email as EmailAddress.T,
              userName: PersonName.C(userName as NonEmptyString.T),
              accountName: accountName as NonEmptyString.T | undefined
            });
          }}
          icon={props.submitButtonIcon}
        >
          {props.submitButtonText}
        </Button>
      </div>
    </div>
  );
};
