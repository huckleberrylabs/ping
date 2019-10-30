import React, { useState } from "react";
import { toast } from "react-toastify";
import { isLeft } from "fp-ts/lib/Either";
import { toUndefined, some, none } from "fp-ts/lib/Option";

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
import { NonEmptyString, PersonName } from "@huckleberryai/core";

// Style
import "./style.css";

type Props = {
  account: Account.T;
  reload: () => void;
};

const IsValidEmail = (input: string) =>
  NonEmptyString.Is(input) && input.indexOf("@") > 0;

export const AccountViewer = (props: Props) => {
  const [changed, hasChanged] = useState<boolean>(false);
  const [account, setAccount] = useState<Account.T>(props.account);
  const name = toUndefined(account.name);
  const billingEmail = toUndefined(account.billingEmail);
  const userName = toUndefined(account.userName.parsed);
  return (
    <div className="account-viewer-container">
      <h1>Account</h1>
      <TextField
        outlined
        label="Account Name"
        value={name}
        onChange={event => {
          const value = (event.target as HTMLInputElement).value;
          const name = NonEmptyString.Is(value) ? some(value) : none;
          setAccount({
            ...account,
            name
          });
          hasChanged(true);
        }}
      />
      <TextField
        outlined
        label="Name"
        value={userName}
        invalid={!NonEmptyString.Is(userName)}
        onChange={event => {
          const value = (event.target as HTMLInputElement).value;
          const userName = PersonName.C(value as NonEmptyString.T);
          setAccount({
            ...account,
            userName
          });
          hasChanged(true);
        }}
      />
      <TextField
        outlined
        label="Email"
        value={account.email}
        placeholder={"email@example.com"}
        invalid={!IsValidEmail(account.email)}
        onChange={event => {
          const value = (event.target as HTMLInputElement).value;
          const email = value;
          setAccount({
            ...account,
            email
          });
          hasChanged(true);
        }}
      />
      <p>
        If no separate billing email is provided, invoices will be sent to the
        email above.
      </p>
      <TextField
        outlined
        label="Billing Email"
        value={billingEmail}
        placeholder={"email@example.com"}
        invalid={
          NonEmptyString.Is(billingEmail) && billingEmail.indexOf("@") < 0
        }
        onChange={event => {
          const value = (event.target as HTMLInputElement).value.trim();
          const billingEmail = NonEmptyString.Is(value) ? some(value) : none;
          setAccount({
            ...account,
            billingEmail
          });
          hasChanged(true);
        }}
      />
      <br />
      <br />
      <div className="account-viewer-save-changes-container">
        <Button
          onClick={async () => {
            const sdk = PrivateSDK.C();
            if (!userName || !NonEmptyString.Is(userName.trim())) {
              toast.warn("Name cannot be left empty", {
                position: "bottom-right",
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true
              });
              return;
            }
            if (!IsValidEmail(account.email)) {
              toast.warn("Email is invalid", {
                position: "bottom-right",
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true
              });
              return;
            }
            if (billingEmail && !IsValidEmail(billingEmail)) {
              toast.warn("Billing Email is invalid", {
                position: "bottom-right",
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true
              });
              return;
            }
            console.log(sdk.Account.Update);
            const maybeUpdated = await sdk.Account.Update(
              account.id,
              account.email as NonEmptyString.T,
              account.userName,
              billingEmail as NonEmptyString.T | undefined,
              name && NonEmptyString.Is(name.trim()) ? name : undefined
            );
            if (isLeft(maybeUpdated)) {
              toast.error("Oops :( Cannot update account at this time.", {
                position: "bottom-right",
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true
              });
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
          disabled={!changed}
        >
          Save Changes
        </Button>
      </div>
    </div>
  );
};
