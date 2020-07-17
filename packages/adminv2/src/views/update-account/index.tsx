import React, { useState } from "react";
import { toast } from "react-toastify";

// Text Field
import { TextField } from "@rmwc/textfield";
import "@rmwc/textfield/styles";

// Button
import { Button } from "@rmwc/button";
import "@rmwc/button/styles";

export const UpdateAccount = () => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  return (
    <>
      <h2>Login</h2>
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
        invalid={email !== "" && email.indexOf("@") < 1}
        onChange={(event) => {
          const value = (event.target as HTMLInputElement).value;
          setEmail(value);
        }}
      />
      <Button
        raised
        onClick={() => {
          toast.success("login settings updated successfully");
        }}
      >
        Save
      </Button>
    </>
  );
};
