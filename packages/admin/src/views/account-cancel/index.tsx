import React, { useState } from "react";
import { toast } from "react-toastify";
import { accountService } from "../../services";
import { isLeft } from "fp-ts/lib/Either";

// UI
import { Modal } from "../../components/modal";
import { Button } from "@rmwc/button";
import "@rmwc/button/styles";
import "./style.css";

export const CancelAccount = () => {
  const [open, setOpen] = useState<boolean>(false);
  const onDeregister = async () => {
    const res = await accountService.deregister();
    if (isLeft(res)) {
      toast.warn(res.left.userMessage);
    } else {
      toast.success("Account cancelled successfully.");
    }
  };
  return (
    <>
      <h2>Danger Zone</h2>
      <Button outlined danger onClick={() => setOpen(true)}>
        Cancel Account
      </Button>
      <Modal open={open} onClose={() => setOpen(false)}>
        <div className="cancel-account-modal">
          <div>
            <h3>Cancel Your Account</h3>
            <p>
              Are you sure you want to cancel your Ping account? All of your
              data will be permanently erased.
            </p>
          </div>
          <div className="cancel-account-modal-buttons">
            <Button onClick={() => setOpen(false)}>Nevermind</Button>
            <Button danger onClick={onDeregister}>
              Yes
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};
