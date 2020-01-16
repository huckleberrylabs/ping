import { Machine } from "xstate";
import { isLeft, isRight, Either, Right } from "fp-ts/lib/Either";
import { PrivateSDK, Widget } from "@huckleberryai/ping";
import { Errors, UUID } from "@huckleberryai/core";
import { PostMachineFactory } from "../../../services/post-machine";
import { CreateAccountFormData } from "../create";

type Context = {
  accountID: UUID.T | undefined;
  widget: Widget.T;
  formData: CreateAccountFormData;
};

interface Schema {
  states: {
    registeringAccount: {};
    addingWidget: {};
    finished: {};
  };
}

type ADD_WIDGET_EVENT = {
  type: "done.invoke.registeringAccount";
  data: Either<Errors.T, UUID.T>;
};

type ACCOUNT_REGISTRATION_COMPLETE_EVENT = {
  type: "done.invoke.addingWidget";
  data: Either<Errors.T, UUID.T>;
};

type Event = ADD_WIDGET_EVENT | ACCOUNT_REGISTRATION_COMPLETE_EVENT;

export const PostAccountRegistrationMachine = (
  widget: Widget.T,
  formData: CreateAccountFormData
) =>
  Machine<Context, Schema, Event>(
    {
      id: "ping:register-account",
      context: {
        accountID: undefined,
        formData,
        widget
      },
      initial: "registeringAccount",
      states: {
        registeringAccount: {
          invoke: {
            id: "registeringAccount",
            src: "registerAccount",
            onDone: [
              {
                target: "addingWidget",
                cond: "success"
              },
              {
                target: "finished",
                cond: "error"
              }
            ]
          }
        },
        addingWidget: {
          invoke: {
            id: "addingWidget",
            src: "addWidget",
            onDone: [
              {
                target: "finished",
                cond: "success"
              },
              {
                target: "finished",
                cond: "error"
              }
            ]
          }
        },
        finished: {
          type: "final",
          data: (context, event) => event.data
        }
      }
    },
    {
      guards: {
        error: (context, event) => isLeft<Errors.T, any>(event.data),
        success: (context, event) => isRight<Errors.T, any>(event.data)
      },
      services: {
        registerAccount: (context, event) =>
          PostMachineFactory(() => {
            return PrivateSDK.C().Account.Register(
              context.formData.email,
              context.formData.userName,
              context.formData.accountName
            );
          }),
        addWidget: (context, event) =>
          PostMachineFactory(() =>
            PrivateSDK.C().Widget.Add(
              (event.data as Right<UUID.T>).right,
              context.widget
            )
          )
      }
    }
  );
