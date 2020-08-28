import { isSome } from "fp-ts/lib/Option";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { isLeft } from "fp-ts/lib/Either";
import { useObservable } from "../../observable";
import { accountService, AccountStates } from "../../services";
import {
  IAM,
  EmailAddress,
  PersonName,
  NonEmptyString,
  Errors,
} from "@huckleberrylabs/ping-core";

// UI
import { ForwardButton } from "../../components/forward-button";
import { ErrorButton } from "../../components/error-button";
import { Loading } from "../../components/loading";
import { TextField } from "@rmwc/textfield";
import "@rmwc/textfield/styles";
import "./style.css";

const Form = (props: { original: IAM.Account.Model.T }) => {
  const { original } = props;
  const [modified, setModified] = useState<boolean>(false);
  const [email, setEmail] = useState<EmailAddress.T>(original.email.address);
  const [name, setName] = useState<string>(
    isSome(original.name) ? original.name.value.parsed : ""
  );
  const onSubmit = async () => {
    if (!EmailAddress.Is(email) || !NonEmptyString.Is(name)) {
      toast.warn("A valid email must be provided.");
      return;
    }
    if (!NonEmptyString.Is(name)) {
      toast.warn("A name must be provided.");
      return;
    }
    const result = await accountService.update(
      IAM.Account.UseCases.Update.Command.C(
        original.id,
        email,
        PersonName.C(name)
      )
    );
    if (isLeft(result)) {
      toast.error(result.left.userMessage);
    } else {
      toast.success("User updated successfully.");
    }
  };
  return (
    <div className="update-account">
      <h2>User</h2>
      <div className="update-account-inner">
        <TextField
          outlined
          label="name"
          value={name}
          invalid={!NonEmptyString.Is(name)}
          onChange={(event) => {
            const value = (event.target as HTMLInputElement).value;
            if (NonEmptyString.Is(value)) {
              setName(value);
              setModified(
                (isSome(original.name) &&
                  value !== original.name.value.parsed) ||
                  modified
              );
            }
          }}
        />
        <TextField
          outlined
          label="email"
          value={email}
          placeholder={"email@example.com"}
          invalid={!EmailAddress.Is(email)}
          onChange={(event) => {
            const value = (event.target as HTMLInputElement).value;
            if (EmailAddress.Is(value)) {
              setEmail(value);
              setModified(value !== original.email.address || modified);
            }
          }}
        />
        <div className="update-billing-save">
          <ForwardButton
            label={"save"}
            icon={"keyboard_arrow_right"}
            disabled={!modified}
            onClick={onSubmit}
          />
        </div>
      </div>
    </div>
  );
};

export const UpdateAccount = () => {
  const state = useObservable(accountService.state);
  if (IAM.Account.Model.Is(state)) return <Form original={state} />;
  if (state === AccountStates.UNINITIALIZED) accountService.get();
  if (Errors.Is(state)) {
    toast.error(state.userMessage);
    return <ErrorButton />;
  }
  // AccountStates.LOADING
  return <Loading />;
};
