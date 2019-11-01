import React, { useState } from "react";
import { toast } from "react-toastify";
import { isLeft } from "fp-ts/lib/Either";
import {
  toUndefined,
  some,
  none,
  isNone,
  Option,
  isSome
} from "fp-ts/lib/Option";

// Text Field
import { TextField } from "@rmwc/textfield";
import "@material/textfield/dist/mdc.textfield.css";
import "@material/floating-label/dist/mdc.floating-label.css";
import "@material/notched-outline/dist/mdc.notched-outline.css";
import "@material/line-ripple/dist/mdc.line-ripple.css";

// Button
import { Button } from "@rmwc/button";
import "@material/button/dist/mdc.button.css";

// Domain
import { Account, PrivateSDK } from "@huckleberryai/ping";
import { NonEmptyString, PersonName, EmailAddress } from "@huckleberryai/core";

// Style
import "./style.css";

type Props = {
  account: Account.T;
  reload: () => void;
};

export const AccountViewer = (props: Props) => {
  const [accountName, setAccountName] = useState<Option<NonEmptyString.T>>(
    props.account.name
  );
  const [userName, setUserName] = useState<PersonName.T>(
    props.account.userName
  );
  const [email, setEmail] = useState<string>(props.account.email);
  const [billingEmail, setBillingEmail] = useState<Option<NonEmptyString.T>>(
    props.account.billingEmail as Option<NonEmptyString.T>
  );
  const accountNameChanged =
    isNone(props.account.name) !== isNone(accountName) ||
    (isSome(props.account.name) &&
      isSome(accountName) &&
      props.account.name.value !== accountName.value);
  const userNameChanged = props.account.userName.parsed !== userName.parsed;
  const emailChanged = props.account.email !== email;
  const billingEmailChanged =
    isNone(props.account.billingEmail) !== isNone(billingEmail) ||
    (isSome(props.account.billingEmail) &&
      isSome(billingEmail) &&
      props.account.billingEmail.value.toString() !==
        billingEmail.value.toString());

  const hasChanged =
    accountNameChanged ||
    userNameChanged ||
    emailChanged ||
    billingEmailChanged;

  return (
    <div className="account-viewer-container">
      <h1>Account</h1>
      <TextField
        outlined
        label="Account Name"
        value={toUndefined(accountName)}
        onChange={event => {
          const value = (event.target as HTMLInputElement).value.trim();
          const name = NonEmptyString.Is(value) ? some(value) : none;
          setAccountName(name);
        }}
      />
      <TextField
        outlined
        label="Name"
        value={toUndefined(userName.parsed)}
        invalid={isNone(userName.first) || isNone(userName.last)}
        onChange={event => {
          const value = (event.target as HTMLInputElement).value;
          const userName = PersonName.C(value as NonEmptyString.T);
          setUserName(userName);
        }}
      />
      <TextField
        outlined
        label="Email"
        value={email}
        placeholder={"email@example.com"}
        invalid={!EmailAddress.Is(email)}
        onChange={event => {
          const value = (event.target as HTMLInputElement).value;
          setEmail(value);
        }}
      />
      <p>
        If no billing email is provided, invoices will be sent to the email
        above.
      </p>
      <TextField
        outlined
        label="Billing Email"
        value={toUndefined(billingEmail)}
        placeholder={"email@example.com"}
        invalid={isSome(billingEmail) && !EmailAddress.Is(billingEmail.value)}
        onChange={event => {
          const value = (event.target as HTMLInputElement).value.trim();
          const billingEmail = NonEmptyString.Is(value) ? some(value) : none;
          setBillingEmail(billingEmail);
        }}
      />
      <br />
      <br />
      <div className="account-viewer-save-changes-container">
        <Button
          onClick={async () => {
            const sdk = PrivateSDK.C();
            if (isNone(userName.first) || isNone(userName.last)) {
              toast.warn("first and last name must be provided", {
                position: "bottom-right",
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true
              });
              return;
            }
            if (!EmailAddress.Is(email)) {
              toast.warn("email must be provided", {
                position: "bottom-right",
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true
              });
              return;
            }
            if (isSome(billingEmail) && !EmailAddress.Is(billingEmail.value)) {
              toast.warn("billing email is invalid", {
                position: "bottom-right",
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true
              });
              return;
            }
            const maybeUpdated = await sdk.Account.Update(
              props.account.id,
              email,
              userName,
              toUndefined(billingEmail as Option<EmailAddress.T>),
              toUndefined(accountName)
            );
            if (isLeft(maybeUpdated)) {
              toast.error(
                "cannot update account at this time, please try again later.",
                {
                  position: "bottom-right",
                  autoClose: 3000,
                  hideProgressBar: true,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true
                }
              );
              return;
            }
            toast.success("account updated.", {
              position: "bottom-right",
              autoClose: 3000,
              hideProgressBar: true,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true
            });
            props.reload();
          }}
          raised
          disabled={!hasChanged}
        >
          Save Changes
        </Button>
      </div>
    </div>
  );
};
