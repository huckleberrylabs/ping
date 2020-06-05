import { Machine, assign } from "xstate";
import { ReactStripeElements } from "react-stripe-elements";
import { Widget } from "@huckleberrylabs/ping";
import { CreateAccountFormData } from "../create";
import { PostAccountRegistrationMachine } from "./apiMachine";
import { isLeft, Either, isRight } from "fp-ts/lib/Either";
import { Errors, UUID } from "@huckleberrylabs/core";

type Context = {
  widget: undefined | Widget.T;
  stage: number;
};

type Schema = {
  states: {
    createWidget: {};
    createAccount: {};
    registering: {};
    error: {};
    success: {};
  };
};

type Event =
  | { type: "BACK" }
  | { type: "CREATE_WIDGET"; value: Widget.T }
  | { type: "REGISTER_ACCOUNT"; value: CreateAccountFormData }
  | {
      type: "done.invoke.registering";
      data: Either<Errors.T, UUID.T>;
    };

export const RegisterAccountMachine = (
  stripe: ReactStripeElements.StripeProps
) =>
  Machine<Context, Schema, Event>(
    {
      id: "ping:register-account",
      initial: "createWidget",
      context: {
        widget: undefined,
        stage: 1,
      },
      states: {
        createWidget: {
          on: {
            CREATE_WIDGET: {
              target: "createAccount",
              actions: assign((context, event) => ({ widget: event.value })),
            },
          },
          entry: assign({ stage: 1 }),
        },
        createAccount: {
          on: {
            REGISTER_ACCOUNT: {
              target: "registering",
            },
            BACK: {
              target: "createWidget",
            },
          },
          entry: assign({ stage: 2 }),
        },
        registering: {
          entry: assign({ stage: 3 }),
          invoke: {
            id: "registering",
            src: "register",
            onDone: [
              {
                target: "success",
                cond: "success",
              },
              {
                target: "error",
                cond: "error",
              },
            ],
          },
        },
        error: {
          type: "final",
          entry: assign({ stage: 4 }),
        },
        success: {
          type: "final",
          entry: assign({ stage: 4 }),
        },
      },
    },
    {
      guards: {
        error: (context, event) =>
          event.type === "done.invoke.registering" &&
          isLeft<Errors.T, any>(event.data),
        success: (context, event) =>
          event.type === "done.invoke.registering" &&
          isRight<Errors.T, any>(event.data),
      },
      services: {
        register: (context, event) =>
          PostAccountRegistrationMachine(
            stripe,
            context.widget as Widget.T,
            event.value
          ),
      },
    }
  );
