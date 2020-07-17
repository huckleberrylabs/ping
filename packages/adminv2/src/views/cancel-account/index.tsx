import React, { useState } from "react";
import { toast } from "react-toastify";

// Button
import { Button } from "@rmwc/button";
import "@rmwc/button/styles";

// Style
import "./style.css";

export const CancelAccount = () => {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <>
      <h2>Danger Zone</h2>
      <Button outlined danger onClick={() => setOpen(true)}>
        Cancel Account
      </Button>
      <div
        className={
          open ? "cancel-account-overlay-open" : "cancel-account-closed"
        }
      ></div>
      <div
        className={open ? "cancel-account-modal-open" : "cancel-account-closed"}
      >
        <div>
          Are you sure you want to cancel your Ping account? All of your data
          will be permanently erased.
        </div>
        <div className={"cancel-account-modal-buttons"}>
          <Button onClick={() => setOpen(false)}>Nevermind</Button>
          <Button
            danger
            onClick={() => toast.success("account cancelled successfully")}
          >
            Yes
          </Button>
        </div>
      </div>
    </>
  );
};
