import { Machine } from "xstate";
import { isLeft, isRight, Either } from "fp-ts/lib/Either";
import { UUID, Errors, Widget } from "@huckleberrylabs/ping-core";
import { PostMachineFactory } from "../../../services/post-machine";
import { SDK } from "../../../sdk";

export const DoneEventType = "done.invoke.post";

interface States {
  states: {
    add: {};
    adding: {};
    added: {};
  };
}

type Event =
  | { type: "ADD"; value: Widget.Settings.Model.T }
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
            SDK.Widget.Add(accountID, event.value as Widget.Settings.Model.T)
          ),
      },
    }
  );
