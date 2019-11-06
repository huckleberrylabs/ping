import React from "react";
import { RouteComponentProps } from "react-router";
import { useMachine } from "@xstate/react";
import { isLeft } from "fp-ts/lib/Either";

// Loading
import { CircularProgress } from "@rmwc/circular-progress";
import "@rmwc/circular-progress/circular-progress.css";

// Toasts
import { toast } from "react-toastify";

// Style
import "./style.css";

// Domain
import { UUID } from "@huckleberryai/core";
import { showErrorToast } from "../../../services/error-toasts";
import { CreateWidget } from "../create";
import { AddWidgetMachineFactory } from "./machine";

type Props = RouteComponentProps & {
  accountID: UUID.T;
  reload: () => void;
};

export const AddWidget = (props: Props) => {
  const [current, send] = useMachine(AddWidgetMachineFactory(props.accountID));
  if (current.event.type === "done.invoke.post") {
    const result = current.event.data;
    if (isLeft(result)) showErrorToast(result.left);
    else {
      toast.success("Widget Added Successfully");
      props.history.push(`/widgets/${result.right}`);
      props.reload();
    }
  }
  return (
    <CreateWidget
      {...props}
      disabled={!current.matches("add")}
      title="Add a Widget"
      showBackButton={true}
      submitButtonText={
        current.matches("add")
          ? "Add"
          : current.matches("adding")
          ? "Loading"
          : "Added!"
      }
      submitButtonIcon={current.matches("adding") ? <CircularProgress /> : null}
      onSubmit={widget => send({ type: "ADD", value: widget })}
    />
  );
};
