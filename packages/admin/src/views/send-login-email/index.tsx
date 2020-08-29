import React, { useState } from "react";
import { Link } from "react-router-dom";
import { isLeft } from "fp-ts/lib/Either";
import { toast } from "react-toastify";
import { Errors, EmailAddress, Config } from "@huckleberrylabs/ping-core";
import { Routes } from "../../config";
import { authService } from "../../services";

// UI
import { Loading } from "../../components/loading";
import { Button } from "@rmwc/button";
import "@rmwc/button/styles";
import { TextField } from "@rmwc/textfield";
import "@rmwc/textfield/styles";
import "./style.css";

type Stage = "idle" | "loading" | "sent" | "not-found" | "error";

export const SendLoginEmail = () => {
  const [email, setEmail] = useState<string>("");
  const [stage, setStage] = useState<Stage>("idle");

  const submitForm = async () => {
    if (!EmailAddress.Is(email)) {
      toast.warn("A valid email must be provided.");
    } else {
      const sentMaybe = await authService.sendLoginEmail(email);
      if (isLeft(sentMaybe)) {
        if (Errors.NotFound.Is(sentMaybe.left)) {
          setStage("not-found");
        } else {
          setStage("error");
        }
      } else {
        setStage("sent");
      }
    }
  };

  return (
    <div className="send-login-email-container">
      <div className="send-login-email-modal">
        <h1>Login</h1>
        {stage === "idle" ? (
          <div className="send-login-email-form">
            <TextField
              outlined
              label="email"
              value={email}
              invalid={email !== "" && email.indexOf("@") < 1}
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
            <Loading />
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
