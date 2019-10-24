import React, { useState } from "react";
import { toast } from "react-toastify";
import { Button } from "@rmwc/button";
import { TextField } from "@rmwc/textfield";
import { CircularProgress } from "@rmwc/circular-progress";
import { ChromePicker } from "react-color";
import "@material/textfield/dist/mdc.textfield.css";
import "@material/form-field/dist/mdc.form-field.css";
import "@material/floating-label/dist/mdc.floating-label.css";
import "@material/notched-outline/dist/mdc.notched-outline.css";
import "@material/button/dist/mdc.button.css";
import "@rmwc/circular-progress/circular-progress.css";
import "./style.css";
import { Phone, Url, Color } from "@huckleberryai/core";

type Stage = "design" | "activate" | "loading" | "finished" | "error";

const WidgetDesigner = (
  phone: Phone.T,
  homePage: Url.T,
  color: Color.T,
  setStage: (input: string) => void,
  setPhone: (input: string) => void,
  setHomePage: (input: string) => void,
  setColor: (input: string) => void
) => {
  return (
    <div className="sign-up-design">
      <TextField
        outlined
        label="Home Page"
        value={homePage}
        placeholder={"https://example.com"}
        onChange={event =>
          setHomePage((event.target as HTMLInputElement).value)
        }
      />
      <TextField
        outlined
        label="Phone"
        value={phone}
        placeholder={"+1 123 456 7890"}
        onChange={event => setPhone((event.target as HTMLInputElement).value)}
      />
      <div className="color-container">
        <Button
          onClick={this.onToggleColorPicker}
          raised
          dense
          style={{
            backgroundColor: widget.color,
            color: Color.IsLight(widget.color) ? "black" : "white"
          }}
        >
          Change Color
        </Button>
        {displayColorPicker ? (
          <div className="color-picker-popover">
            <div
              className="color-picker-cover"
              onClick={this.onToggleColorPicker}
            />
            <ChromePicker
              color={widget.color as string}
              onChangeComplete={(input: { hex: string }) =>
                this.onChangeColor(input.hex)
              }
            />
          </div>
        ) : null}
      </div>
      <Button
        onClick={async () => {
          if (!Url.Is(homePage)) {
            toast.warn("Invalid Home Page URL", {
              position: "bottom-right",
              autoClose: 2000,
              hideProgressBar: true,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true
            });
            return;
          }
          if (!Phone.Is(phone)) {
            toast.warn("Invalid Phone", {
              position: "bottom-right",
              autoClose: 2000,
              hideProgressBar: true,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true
            });
            return;
          }
          if (!Color.Is(color)) {
            toast.warn("Invalid Color", {
              position: "bottom-right",
              autoClose: 2000,
              hideProgressBar: true,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true
            });
            return;
          }
          setStage("activate");
        }}
        raised
      >
        Send
      </Button>
    </div>
  );
};

const Loader = (
  <div className="sign-up-loader">
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

export const SignUp = () => {
  const [stage, setStage] = useState<Stage>("design");
  return (
    <div className="sign-up-container">
      <div className="sign-up-modal">
        <h1>Sign Up</h1>
        {stage === "idle"
          ? WidgetDesigner(setStage)
          : stage === "loading"
          ? Loader
          : stage === "sent"
          ? SentMessage
          : ErrorMessage}
      </div>
    </div>
  );
};
