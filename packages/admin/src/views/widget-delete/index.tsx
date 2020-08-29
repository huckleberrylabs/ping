import { isLeft } from "fp-ts/lib/Either";
import React, { useState } from "react";
import { useHistory } from "react-router";
import { toast } from "react-toastify";
import { Routes } from "../../config";
import { widgetService } from "../../services";
import { UUID } from "@huckleberrylabs/ping-core";

// UI
import { Modal } from "../../components/modal";
import { Button } from "@rmwc/button";
import "@rmwc/button/styles";
import "./style.css";

type Props = {
  id: UUID.T;
};

export const DeleteWidget = (props: Props) => {
  const history = useHistory();
  const [open, setOpen] = useState<boolean>(false);
  return (
    <>
      <h2>Danger Zone</h2>
      <Button outlined danger onClick={() => setOpen(true)}>
        Delete Widget
      </Button>
      <Modal open={open} onClose={() => setOpen(false)}>
        <div className="delete-widget-modal">
          <div>
            <h3>Delete Widget</h3>
            <p>
              Are you sure you want to delete this widget? All of the associated
              analytics data will be permanently erased. You may also disable
              the widget in order to retain your data.
            </p>
          </div>
          <div className="delete-widget-modal-buttons">
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button
              danger
              onClick={async () => {
                const result = await widgetService.deleteWidget(props.id);
                if (isLeft(result)) {
                  toast.error(result.left.userMessage);
                } else {
                  toast.success("Widget deleted successfully.");
                  history.push(Routes.widgets);
                }
                setOpen(false);
              }}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};
