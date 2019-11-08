import React, { useState } from "react";
import { isLeft } from "fp-ts/lib/Either";

// Toast
import { toast } from "react-toastify";

// Button
import { Button } from "@rmwc/button";
import "@material/button/dist/mdc.button.css";

// Text Field
import { TextField } from "@rmwc/textfield";
import "@material/textfield/dist/mdc.textfield.css";
import "@material/form-field/dist/mdc.form-field.css";
import "@material/floating-label/dist/mdc.floating-label.css";
import "@material/notched-outline/dist/mdc.notched-outline.css";

// Loading
import { CircularProgress } from "@rmwc/circular-progress";
import "@rmwc/circular-progress/circular-progress.css";

// Style
import "./style.css";

// Domain
import * as Auth from "../../../services/authentication";
import { EmailAddress, NonEmptyString, Errors } from "@huckleberryai/core";
import { PrivateSDK, Config } from "@huckleberryai/ping";
import { Link, RouteComponentProps } from "react-router-dom";

type Stage = "idle" | "loading" | "sent" | "not-found" | "error";

type Props = RouteComponentProps & {};

export const LoginForm = (props: Props) => {
  const [email, setEmail] = useState<string>("");
  const [stage, setStage] = useState<Stage>("idle");

  const query = new URLSearchParams(props.location.search);
  const token = query.get("token");
  if (NonEmptyString.Is(token) && stage !== "loading") {
    Auth.login(token).then(result => {
      if (isLeft(result)) {
        window.location.replace("/login");
        props.history.push("/login");
      } else {
        window.location.reload();
      }
    });
    setStage("loading");
  }

  const submitForm = async () => {
    if (!EmailAddress.Is(email)) {
      toast.warn("a valid email must be provided.");
      return;
    }
    const loginMaybe = await PrivateSDK.C().Account.SendLoginEmail(email);

    if (isLeft(loginMaybe)) {
      if (Errors.NotFound.Is(loginMaybe.left)) {
        setStage("not-found");
        return;
      }
      setStage("error");
      return;
    }
    setStage("sent");
  };
  return (
    <div className="login-container">
      <div className="login-modal">
        <h1>login.</h1>
        {stage === "idle" ? (
          <div className="login-form">
            <TextField
              outlined
              label="email"
              value={email}
              invalid={email !== "" && !EmailAddress.Is(email)}
              onChange={event =>
                setEmail((event.target as HTMLInputElement).value)
              }
              onKeyPress={event => {
                if (event.key === "Enter") submitForm();
              }}
            />
            <p>
              a{" "}
              <span role="img" aria-label="sparkles">
                ✨
              </span>
              magic{" "}
              <span role="img" aria-label="sparkles">
                ✨
              </span>{" "}
              link will be sent to you via email.
            </p>
            <Button
              onClick={submitForm}
              raised
              trailingIcon="keyboard_arrow_right"
            >
              send
            </Button>
            <p>
              dont have an account?{" "}
              <Link className="styled-hyperlink" to="/register">
                register here.
              </Link>
            </p>
          </div>
        ) : stage === "loading" ? (
          <div className="login-loader">
            <CircularProgress size="large" />
          </div>
        ) : stage === "sent" ? (
          <div>
            success! please check your inbox for an email. it may take a minute
            to arrive.
          </div>
        ) : stage === "not-found" ? (
          <div className="login-error">
            <div>we couldn't find an account associated with that email.</div>
            <Button
              onClick={() => {
                setStage("idle");
              }}
              raised
              icon="keyboard_arrow_left"
            >
              try another
            </Button>
          </div>
        ) : (
          <div className="login-error">
            <p>
              we had an issue on our end, please try again in a few minutes. if
              that doesn't work, please email us at{" "}
              <a href={`mail-to:${Config.SupportEmail}`}>
                {Config.SupportEmail}
              </a>
            </p>

            <Button
              onClick={() => {
                setStage("idle");
              }}
              raised
              icon="keyboard_arrow_left"
            >
              back
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
