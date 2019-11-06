import { Machine } from "xstate";
import { isLeft, isRight, Either } from "fp-ts/lib/Either";
import { Widget, PrivateSDK } from "@huckleberryai/ping";
import { UUID, Errors } from "@huckleberryai/core";
import { PostMachineFactory } from "../../../services/post-machine";

interface States {
  states: {
    add: {};
    adding: {};
    added: {};
  };
}

type Event =
  | { type: "ADD"; value: Widget.T }
  | { type: "done.invoke.post"; data: Either<Errors.T, UUID.T> };

export const AddWidgetMachineFactory = (accountID: UUID.T) =>
  Machine<{}, States, Event>(
    {
      id: "ping:account:add-widget",
      initial: "add",
      states: {
        add: {
          on: {
            ADD: {
              target: "adding"
            }
          }
        },
        adding: {
          invoke: {
            id: "post",
            src: "postWidget",
            onDone: [
              {
                target: "added",
                cond: "success"
              },
              {
                target: "add",
                cond: "error"
              }
            ]
          }
        },
        added: {
          type: "final"
        }
      }
    },
    {
      guards: {
        error: (context, event) =>
          event.type === "done.invoke.post" && isLeft(event.data),
        success: (context, event) =>
          event.type === "done.invoke.post" && isRight(event.data)
      },
      services: {
        postWidget: (context, event) =>
          PostMachineFactory(() =>
            PrivateSDK.C().Widget.Add(accountID, event.value as Widget.T)
          )
      }
    }
  );
