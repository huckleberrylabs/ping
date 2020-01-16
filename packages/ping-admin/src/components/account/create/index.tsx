import React, { useState } from "react";
import { isSome } from "fp-ts/lib/Option";
import { RouteComponentProps } from "react-router";

// Icon
import { IconPropT } from "@rmwc/types";

// Text Field
import { TextField } from "@rmwc/textfield";
import "@material/textfield/dist/mdc.textfield.css";
import "@material/floating-label/dist/mdc.floating-label.css";
import "@material/notched-outline/dist/mdc.notched-outline.css";
import "@material/line-ripple/dist/mdc.line-ripple.css";

// Form Fields
import { BackButton } from "../../form-fields/back-button";
import { ForwardButton } from "../../form-fields/forward-button";

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
  disabled: boolean;
  submitButtonText: string;
  submitButtonIcon: IconPropT;
  onBack: () => void;
  onSubmit: (form: CreateAccountFormData) => void;
};

export const CreateAccount = (props: Props) => {
  const [accountName, setAccountName] = useState<string>();
  const [userName, setUserName] = useState<string>();
  const [email, setEmail] = useState<string>();

  return (
    <div className="create-account-container">
      <h1>create account.</h1>
      <TextField
        outlined
        label="organization name"
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
        label="first and last name"
        disabled={props.disabled}
        value={userName}
        invalid={userName !== undefined && !IsValidFirstLastName(userName)}
        onChange={event =>
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
        onChange={event => setEmail((event.target as HTMLInputElement).value)}
      />

      <div className="create-account-controls">
        <BackButton disabled={props.disabled} onClick={props.onBack} />
        <ForwardButton
          label={props.submitButtonText}
          icon={props.submitButtonIcon}
          disabled={
            props.disabled ||
            !IsValidFirstLastName(userName) ||
            !EmailAddress.Is(email)
          }
          onClick={() => {
            props.onSubmit({
              email: email as EmailAddress.T,
              userName: PersonName.C(userName as NonEmptyString.T),
              accountName: accountName as NonEmptyString.T | undefined
            });
          }}
        />
      </div>
    </div>
  );
};
