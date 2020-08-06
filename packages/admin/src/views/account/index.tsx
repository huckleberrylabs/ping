import React from "react";

import "./style.css";

// Use-Cases
import { UpdateAccount } from "../update-account";
import { UpdateBilling } from "../update-billing";
import { CancelAccount } from "../cancel-account";
import { Invoices } from "../invoices";

// Config
import { Config } from "@huckleberrylabs/ping-core";

export const Account = () => {
  return (
    <div className="account">
      <h1>Account</h1>
      <div className="account-inner">
        <div>
          <div>
            <h2>Contacting Support</h2>
            <p>
              Please dont hesitate to contact the Ping team at{" "}
              <a href={`mail-to:${Config.SupportEmail}`}>
                {Config.SupportEmail}
              </a>{" "}
              or through the ping widget located at the bottom right of this
              website if you need our assistance, feel unsatisfied with the
              product or have any questions :)
            </p>
          </div>
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
