import { Machine } from "xstate";
import { isLeft, isRight, Either } from "fp-ts/lib/Either";
import { Widget, PrivateSDK } from "@huckleberrylabs/ping";
import { UUID, Errors } from "@huckleberrylabs/core";
import { PostMachineFactory } from "../../../services/post-machine";

export const DoneEventType = "done.invoke.post";

interface States {
  states: {
    add: {};
    adding: {};
    added: {};
  };
}

type Event =
  | { type: "ADD"; value: Widget.T }
  | { type: typeof DoneEventType; data: Either<Errors.T, UUID.T> };

export const AddWidgetMachineFactory = (accountID: UUID.T) =>
  Machine<{}, States, Event>(
    {
      id: "ping:account:add-widget",
      initial: "add",
      states: {
        add: {
          on: {
            ADD: {
              target: "adding",
            },
          },
        },
        adding: {
          invoke: {
            id: "post",
            src: "postWidget",
            onDone: [
              {
                target: "added",
                cond: "success",
              },
              {
                target: "add",
                cond: "error",
              },
            ],
          },
        },
        added: {
          type: "final",
        },
      },
    },
    {
      guards: {
        error: (context, event) =>
          event.type === DoneEventType && isLeft(event.data),
        success: (context, event) =>
          event.type === DoneEventType && isRight(event.data),
      },
      services: {
        postWidget: (context, event) =>
          PostMachineFactory(() =>
            PrivateSDK.C().Widget.Add(accountID, event.value as Widget.T)
          ),
      },
    }
  );
