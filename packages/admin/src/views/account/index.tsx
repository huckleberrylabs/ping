import React from "react";
import { Config } from "@huckleberrylabs/ping-core";
import { UpdateAccount } from "../account-update";
import { UpdateBilling } from "../billing-update";
import { CancelAccount } from "../account-cancel";
import { Invoices } from "../invoice-list";

export const Account = () => {
  return (
    <div className="container">
      <h1>Account</h1>
      <div className="inner-container">
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
              product or have any questions.
            </p>
          </div>
          <UpdateBilling />
          <Invoices />
        </div>
        <div>
          <UpdateAccount />
          <CancelAccount />
        </div>
      </div>
    </div>
  );
};
