import React, { useState } from "react";
import { toast } from "react-toastify";
import { Button } from "@rmwc/button";
import { TextField } from "@rmwc/textfield";
import { CircularProgress } from "@rmwc/circular-progress";
import "@material/textfield/dist/mdc.textfield.css";
import "@material/form-field/dist/mdc.form-field.css";
import "@material/floating-label/dist/mdc.floating-label.css";
import "@material/notched-outline/dist/mdc.notched-outline.css";
import "@material/button/dist/mdc.button.css";
import "@rmwc/circular-progress/circular-progress.css";
import "./style.css";

type Stage = "idle" | "loading" | "sent" | "error";
type Email = string;

const Idle = (
  email: Email,
  setEmail: (input: string) => void,
  setStage: (input: Stage) => void
) => {
  return (
    <div className="login-form">
      <TextField
        outlined
        label="Email"
        value={email}
        placeholder={"joe@gmail.com"}
        onChange={event => setEmail((event.target as HTMLInputElement).value)}
      />
      <p>a ✨magic ✨link will be sent to you via email.</p>
      <Button
        onClick={async () => {
          localStorage.setItem("accountID", "WOOT");
          window.location.reload();
          if (email.indexOf("@") < 0) {
            toast.warn("Invalid Email", {
              position: "bottom-right",
              autoClose: 3000,
              hideProgressBar: true,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true
            });
            return;
          }
          /*
            res = await sdk.sendLoginEmail()
            isLeft(res) ? setStage("error") : setStage("sent");
          */
        }}
        raised
      >
        Send
      </Button>
      <p>
        dont have an account? sign up <a href="/sign-up">here</a>
      </p>
    </div>
  );
};

const Loader = (
  <div className="login-loader">
    <CircularProgress size="large" />
  </div>
);
const SentMessage = (
  <div>Great Success! Please check your inbox for our email.</div>
);
const ErrorMessage = (
  <div>
    <br />
    <br />
    Looks like we had an issue on our end, please try again in a few minutes.
    <br />
    <br />
    If that doesn't work, please email our CTO at{" "}
    <a href="mail-to:bugs@ping.buzz">bugs@ping.buzz</a>
  </div>
);

export const Login = () => {
  const [email, setEmail] = useState<Email>("");
  const [stage, setStage] = useState<Stage>("idle");
  return (
    <div className="login-container">
      <div className="login-modal">
        <h1>Login</h1>
        {stage === "idle"
          ? Idle(email, setEmail, setStage)
          : stage === "loading"
          ? Loader
          : stage === "sent"
          ? SentMessage
          : ErrorMessage}
      </div>
    </div>
  );
};
