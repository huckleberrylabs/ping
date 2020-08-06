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

// Form Fields
import { PromoCodeField } from "../../form-fields/promo-code-field";
import { BackButton } from "../../form-fields/back-button";
import { ForwardButton } from "../../form-fields/forward-button";

// Style
import "./style.css";

// Domain
import {
  PersonName,
  NonEmptyString,
  EmailAddress,
  Billing,
} from "@huckleberrylabs/ping-core";

export type CreateAccountFormData = {
  email: EmailAddress.T;
  userName: PersonName.T;
  accountName?: NonEmptyString.T;
  promoCode?: Billing.Values.PromoCode.T;
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
  const query = new URLSearchParams(props.location.search);
  const queryPromoCode = query.get("promo");
  const initialPromoCode = Billing.Values.PromoCode.Is(queryPromoCode)
    ? queryPromoCode
    : undefined;
  console.log(initialPromoCode);

  const [accountName, setAccountName] = useState<string>();
  const [userName, setUserName] = useState<string>();
  const [email, setEmail] = useState<string>();
  const [promoCode, setPromoCode] = useState<
    Billing.Values.PromoCode.T | undefined
  >(initialPromoCode);
  const [card, setCard] = useState<stripe.elements.ElementChangeResponse>();

  return (
    <div className="create-account-container">
      <h1>create account.</h1>
      <TextField
        outlined
        label="organization name"
        placeholder={"jenny's yoga studio"}
        disabled={props.disabled}
        value={accountName}
        onChange={(event) =>
          setAccountName((event.target as HTMLInputElement).value)
        }
      />
      <TextField
        outlined
        required
        label="first and last name"
        disabled={props.disabled}
        value={userName}
        invalid={userName !== undefined && !IsValidFirstLastName(userName)}
        onChange={(event) =>
          setUserName((event.target as HTMLInputElement).value)
        }
      />
      <TextField
        outlined
        label="email"
        required
        disabled={props.disabled}
        value={email}
        placeholder={"email@example.com"}
        invalid={email !== undefined && !EmailAddress.Is(email)}
        onChange={(event) => setEmail((event.target as HTMLInputElement).value)}
      />
      <PromoCodeField
        disabled={props.disabled}
        initialValue={initialPromoCode}
        onSelect={(promoCode) => setPromoCode(promoCode)}
      />
      <br />
      <CardElement
        disabled={props.disabled}
        hidePostalCode={false}
        placeholderCountry="ca"
        supportedCountries={["ca", "us"]}
        classes={{
          base: "register-account-stripe mdc-ripple-surface",
        }}
        onChange={(change) => setCard(change)}
      />
      <p>You will be charged $20 USD per year, minus the applied discount.</p>
      <div className="create-account-controls">
        <BackButton disabled={props.disabled} onClick={props.onBack} />
        <ForwardButton
          label={props.submitButtonText}
          icon={props.submitButtonIcon}
          disabled={
            props.disabled ||
            !IsValidFirstLastName(userName) ||
            !EmailAddress.Is(email) ||
            !card ||
            !card.complete
          }
          onClick={() => {
            props.onSubmit({
              promoCode: promoCode,
              email: email as EmailAddress.T,
              userName: PersonName.C(userName as NonEmptyString.T),
              accountName: accountName as NonEmptyString.T | undefined,
            });
          }}
        />
      </div>
    </div>
  );
};
