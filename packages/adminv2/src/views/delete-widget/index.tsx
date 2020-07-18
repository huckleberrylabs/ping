import React, { useState } from "react";
import { toast } from "react-toastify";

// Button
import { Button } from "@rmwc/button";
import "@rmwc/button/styles";

// Style
import "./style.css";

export const DeleteWidget = () => {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <>
      <h2>Danger Zone</h2>
      <Button outlined danger onClick={() => setOpen(true)}>
        Delete Widget
      </Button>
      <div
        className={open ? "delete-widget-overlay-open" : "delete-widget-closed"}
      ></div>
      <div
        className={open ? "delete-widget-modal-open" : "delete-widget-closed"}
      >
        <div>
          <p>
            Are you sure you want to delete this widget? All of the associated
            analytics data will be permanently erased.
          </p>
        </div>
        <div className={"delete-widget-modal-buttons"}>
          <Button onClick={() => setOpen(false)}>Nevermind</Button>
          <Button
            danger
            onClick={() => toast.success("widget deleted successfully")}
          >
            Yes
          </Button>
        </div>
      </div>
    </>
  );
};
