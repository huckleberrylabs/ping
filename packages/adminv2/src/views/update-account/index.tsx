import React, { useState } from "react";
import { toast } from "react-toastify";

import { ForwardButton } from "../../components/forward-button";

// Text Field
import { TextField } from "@rmwc/textfield";
import "@rmwc/textfield/styles";

// Loading
import { CircularProgress } from "@rmwc/circular-progress";
import "@rmwc/circular-progress/styles";

import "./style.css";

export const UpdateAccount = () => {
  const [loading] = useState<boolean>(false);
  const [name, setName] = useState<string>("Mossab Otman Basir");
  const [email, setEmail] = useState<string>("mossab@huckleberry.app");

  return (
    <div className="update-account">
      <h2>User</h2>
      <div className="update-account-inner">
        <TextField
          outlined
          label="name"
          value={name}
          invalid={name === ""}
          onChange={(event) => {
            const value = (event.target as HTMLInputElement).value;
            setName(value);
          }}
        />
        <TextField
          outlined
          label="email"
          value={email}
          placeholder={"email@example.com"}
          invalid={email === "" && email.indexOf("@") < 1}
          onChange={(event) => {
            const value = (event.target as HTMLInputElement).value;
            setEmail(value);
          }}
        />
        <div className="update-billing-save">
          <ForwardButton
            label={loading ? "loading..." : "save"}
            icon={loading ? <CircularProgress /> : "keyboard_arrow_right"}
            disabled={loading}
            onClick={() => {
              toast.success("login settings updated successfully");
            }}
          />
        </div>
      </div>
    </div>
  );
};
