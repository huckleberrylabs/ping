import React from "react";
import { RouteComponentProps } from "react-router";
import { useMachine } from "@xstate/react";
import { isLeft } from "fp-ts/lib/Either";

// Loading
import { CircularProgress } from "@rmwc/circular-progress";
import "@rmwc/circular-progress/circular-progress.css";

// Toasts
import { toast } from "react-toastify";

// Services
import { showErrorToast } from "../../../services/error-toasts";

// Domain
import { UUID } from "@huckleberrylabs/core";
import { CreateWidgetForm } from "../create-form";
import { AddWidgetMachineFactory, DoneEventType } from "./machine";

type Props = RouteComponentProps & {
  accountID: UUID.T;
  reload: () => void;
};

export const AddWidgetForm = (props: Props) => {
  const [current, send] = useMachine(AddWidgetMachineFactory(props.accountID));
  if (current.event.type === DoneEventType) {
    const result = current.event.data;
    if (isLeft(result)) showErrorToast(result.left);
    else {
      toast.success("widget added successfully");
      props.history.push(`/widgets/${result.right}`);
      props.reload();
    }
  }
  return (
    <CreateWidgetForm
      {...props}
      disabled={!current.matches("add")}
      title="add a widget"
      showBackButton={true}
      forwardButtonLabel={
        current.matches("add")
          ? "add it"
          : current.matches("adding")
          ? "loading..."
          : "done"
      }
      forwardButtonIcon={
        current.matches("add") ? (
          "keyboard_arrow_right"
        ) : current.matches("adding") ? (
          <CircularProgress />
        ) : (
          "done"
        )
      }
      onSubmit={(widget) => send({ type: "ADD", value: widget })}
    />
  );
};
