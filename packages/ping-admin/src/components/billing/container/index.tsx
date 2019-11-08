import React from "react";
import { InvoiceList } from "../invoice-list";
import { UpdatePaymentForm } from "../update-payment-form";

import "./style.css";

type Props = {};
export const Billing = (props: Props) => {
  return (
    <div className="billing">
      <h1>billing</h1>
      <div>
        <h2>payment info</h2>
        <UpdatePaymentForm />
      </div>
      <div>
        <h2>invoices</h2>
        <InvoiceList />
      </div>
    </div>
  );
};
