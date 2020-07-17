import React from "react";

// Use-Cases
import { UpdateAccount } from "../update-account";
import { UpdateBilling } from "../update-billing";
import { CancelAccount } from "../cancel-account";

export const Account = () => {
  return (
    <>
      <h1>Account</h1>
      <UpdateAccount />
      <UpdateBilling />
      <CancelAccount />
    </>
  );
};
