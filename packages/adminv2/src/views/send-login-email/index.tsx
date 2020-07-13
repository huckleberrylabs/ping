import React, { useState } from "react";
import { Link } from "react-router-dom";
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
import { EmailAddress, Errors } from "@huckleberrylabs/ping-core/lib/values";
import * as Config from "@huckleberrylabs/ping-core/lib/config";
import { Routes } from "../../config";

type Stage = "idle" | "loading" | "sent" | "not-found" | "error";

type Props = {};

export const SendLoginEmail = (props: Props) => {
  const [email, setEmail] = useState<string>("");
  const [stage, setStage] = useState<Stage>("idle");

  const submitForm = async () => {
    if (!EmailAddress.Is(email)) {
      toast.warn("a valid email must be provided.");
      return;
    }
    // TODO call a sendLoginEmail API method

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
    <div className="send-login-email-container">
      <div className="send-login-email-modal">
        <h1>login.</h1>
        {stage === "idle" ? (
          <div className="send-login-email-form">
            <TextField
              outlined
              label="email"
              value={email}
              invalid={email !== "" && !EmailAddress.Is(email)}
              onChange={(event) =>
                setEmail((event.target as HTMLInputElement).value)
              }
              onKeyPress={(event) => {
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
              <Link className="styled-hyperlink" to={Routes.register}>
                register here.
              </Link>
            </p>
          </div>
        ) : stage === "loading" ? (
          <div className="send-login-email-loader">
            <CircularProgress size="large" />
          </div>
        ) : stage === "sent" ? (
          <div>
            success! please check your inbox for an email. it may take a minute
            to arrive.
          </div>
        ) : stage === "not-found" ? (
          <div className="send-login-email-error">
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
          <div className="send-login-email-error">
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
