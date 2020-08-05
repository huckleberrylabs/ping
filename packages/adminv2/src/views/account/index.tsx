import React from "react";

import "./style.css";

// Use-Cases
import { UpdateAccount } from "../update-account";
import { UpdateBilling } from "../update-billing";
import { CancelAccount } from "../cancel-account";
import { Invoices } from "../invoices";

export const Account = () => {
  return (
    <div className="account">
      <h1>Account</h1>
      <div className="account-inner">
        <div>
          <UpdateBilling />
          <Invoices />
        </div>
        <div className="account-right">
          <UpdateAccount />
          <CancelAccount />
        </div>
      </div>
    </div>
  );
};
