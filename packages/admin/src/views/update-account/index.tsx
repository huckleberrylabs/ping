import React, { useState } from "react";
import { toast } from "react-toastify";
import { useObservable } from "../../observable";

// UI
import { ForwardButton } from "../../components/forward-button";
import { Button } from "@rmwc/button";
import "@rmwc/button/styles";
import { TextField } from "@rmwc/textfield";
import "@rmwc/textfield/styles";
import { CircularProgress } from "@rmwc/circular-progress";
import "@rmwc/circular-progress/styles";
import "./style.css";

// Domain
import { accountService } from "../../services";
import {
  IAM,
  EmailAddress,
  PersonName,
  NonEmptyString,
  Errors,
} from "@huckleberrylabs/ping-core";

export const UpdateAccount = () => {
  const state = useObservable(accountService.state);
  const [loading, setLoading] = useState<boolean>(false);
  const [name, setName] = useState<string>(
    IAM.Account.Model.Is(state) ? state.name.parsed : ""
  );
  const [email, setEmail] = useState<string>(
    IAM.Account.Model.Is(state) ? state.email.address : ""
  );
  if (state === "Unitialized") {
    accountService.get();
    return <></>;
  }
  if (state === "Loading") {
    return (
      <>
        <CircularProgress />
      </>
    );
  }
  if (Errors.Is(state)) {
    toast.error(`${state.type} occured`);
    return (
      <div className="update-account">
        An Error Occured :/
        <Button onClick={() => window.location.reload()} raised>
          Reload
        </Button>
      </div>
    );
  }
  return (
    <div className="update-account">
      <h2>User</h2>
      <div className="update-account-inner">
        <TextField
          outlined
          label="name"
          value={name}
          invalid={NonEmptyString.Is(name)}
          onChange={(event) =>
            setName((event.target as HTMLInputElement).value)
          }
        />
        <TextField
          outlined
          label="email"
          value={email}
          placeholder={"email@example.com"}
          invalid={!EmailAddress.Is(email)}
          onChange={(event) =>
            setEmail((event.target as HTMLInputElement).value)
          }
        />
        <div className="update-billing-save">
          <ForwardButton
            label={loading ? "loading..." : "save"}
            icon={loading ? <CircularProgress /> : "keyboard_arrow_right"}
            disabled={loading}
            onClick={async () => {
              setLoading(true);
              if (!EmailAddress.Is(email)) {
                toast.warn("invalid email");
                return;
              }
              if (!NonEmptyString.Is(name)) {
                toast.warn("name cannot be empty");
                return;
              }
              await accountService.update(
                IAM.Account.UseCases.Update.Command.C(
                  state.id,
                  email,
                  PersonName.C(name)
                )
              );
              setLoading(false);
            }}
          />
        </div>
      </div>
    </div>
  );
};
