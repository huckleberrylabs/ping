import React from "react";

// Domain
import { Config } from "@huckleberrylabs/ping";

type Props = {};
export const UpdatePaymentForm = (props: Props) => {
  return (
    <div>
      <p>
        updating your payment information is under active development. If you'd
        like to change your payment method now, shoot us an email at{" "}
        <a href={`mail-to:${Config.SupportEmail}`}>{Config.SupportEmail}</a> or
        text us via ping
      </p>
    </div>
  );
};
