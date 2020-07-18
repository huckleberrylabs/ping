import React from "react";

import "./style.css";

// Use-Cases
import { UpdateAccount } from "../update-account";
import { UpdateBilling } from "../update-billing";
import { CancelAccount } from "../cancel-account";

export const Account = () => {
  return (
    <div className="account">
      <h1>Account</h1>
      <div className="account-inner">
        <UpdateBilling />
        <div className="account-right">
          <UpdateAccount />
          <CancelAccount />
        </div>
      </div>
    </div>
  );
};
