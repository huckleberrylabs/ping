import React, { useState } from "react";
import axios from "axios";
import {
  Config,
  IAM,
  Billing,
  StatusCode,
  Errors,
} from "@huckleberrylabs/ping-core";
import { UpdateAccount } from "../account-update";
/* import { UpdateBilling } from "../billing-update"; */
import { CancelAccount } from "../account-cancel";
/* import { Invoices } from "../invoice-list"; */
import { ForwardButton } from "../../components/forward-button";
import { CircularProgress } from "@rmwc/circular-progress";
import "@rmwc/circular-progress/styles";
import { accountService } from "../../services";
import { useObservable } from "../../observable";
import { toast } from "react-toastify";
import { Loading } from "../../components/loading";

export const Account = () => {
  const [loading, setLoading] = useState(false);
  const account = useObservable(accountService.state);
  console.log(account);
  const onOpenBillingPortal = async () => {
    if (IAM.Account.Model.Is(account))
      try {
        setLoading(true);
        const res = await axios.post(
          Config.GetEndpoint(Billing.UseCases.OpenBillingPortal.Route),
          Billing.UseCases.OpenBillingPortal.Command.Encode(
            Billing.UseCases.OpenBillingPortal.Command.C(
              // @ts-ignore
              account.customer,
              account.id
            )
          ),
          {
            withCredentials: true,
            validateStatus: () => true,
          }
        );
        setLoading(false);
        if (res.status === StatusCode.OK) {
          window.location.replace(res.data.url);
        } else {
          const error = Errors.FromStatusCode(res.status, res.data);
          toast.warn(error.userMessage);
        }
      } catch (err) {
        setLoading(false);
        const error = Errors.Adapter.C(
          "Update Billing",
          `update ${err.message}`
        );
        toast.warn(error.userMessage);
      }
  };
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
          <UpdateAccount />
          <div>
            <h2>Billing</h2>
            {!IAM.Account.Model.Is(account) ? (
              <Loading />
            ) : (
              <ForwardButton
                label={loading ? "loading..." : "open portal"}
                icon={loading ? <CircularProgress /> : "keyboard_arrow_right"}
                disabled={loading}
                onClick={onOpenBillingPortal}
              />
            )}
          </div>
          {/* <UpdateBilling /> */}
          {/* <Invoices /> */}
          <CancelAccount />
        </div>
        <div></div>
      </div>
    </div>
  );
};
