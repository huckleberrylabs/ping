import { Machine } from "xstate";
import { isLeft, isRight, Either, left, right, Right } from "fp-ts/lib/Either";
import { toUndefined } from "fp-ts/lib/Option";
import { ReactStripeElements } from "react-stripe-elements";

import {
  Errors,
  UUID,
  NonEmptyString,
  Widget,
} from "@huckleberrylabs/ping-core";
import { PostMachineFactory } from "../../../services/post-machine";
import { CreateAccountFormData } from "../create";
import { SDK } from "../../../sdk";

const SendToStripe = async (
  stripe: ReactStripeElements.StripeProps,
  formData: CreateAccountFormData
) => {
  const metadata: { [key: string]: string } = {};
  if (formData.accountName) {
    metadata.accountName = formData.accountName;
  }
  const stripeResponse = await stripe.createPaymentMethod("card", {
    billing_details: {
      // Can Also Add Address Object and phone
      email: formData.email,
      name: toUndefined(formData.userName.parsed),
    },
    metadata,
  });
  if (stripeResponse.error || stripeResponse.paymentMethod === undefined)
    return left(Errors.Adapter.C());
  return right({
    ...formData,
    paymentMethod: stripeResponse.paymentMethod.id,
  });
};

type Context = {
  accountID: UUID.T | undefined;
  widget: Widget.Settings.Model.T;
  formData: CreateAccountFormData;
};

interface Schema {
  states: {
    creatingPaymentMethod: {};
    registeringAccount: {};
    addingWidget: {};
    finished: {};
  };
}

type RegisterAccountDTO = CreateAccountFormData & {
  paymentMethod: NonEmptyString.T;
};

type REGISTER_ACCOUNT_EVENT = {
  type: "done.invoke.creatingPaymentMethod";
  data: Either<Errors.T, RegisterAccountDTO>;
};

type ADD_WIDGET_EVENT = {
  type: "done.invoke.registeringAccount";
  data: Either<Errors.T, UUID.T>;
};

type ACCOUNT_REGISTRATION_COMPLETE_EVENT = {
  type: "done.invoke.addingWidget";
  data: Either<Errors.T, UUID.T>;
};

type Event =
  | REGISTER_ACCOUNT_EVENT
  | ADD_WIDGET_EVENT
  | ACCOUNT_REGISTRATION_COMPLETE_EVENT;

export const PostAccountRegistrationMachine = (
  stripe: ReactStripeElements.StripeProps,
  widget: Widget.Settings.Model.T,
  formData: CreateAccountFormData
) =>
  Machine<Context, Schema, Event>(
    {
      id: "ping:register-account",
      context: {
        accountID: undefined,
        formData,
        widget,
      },
      initial: "creatingPaymentMethod",
      states: {
        creatingPaymentMethod: {
          invoke: {
            id: "creatingPaymentMethod",
            src: "createPaymentMethod",
            onDone: [
              {
                target: "registeringAccount",
                cond: "success",
              },
              {
                target: "finished",
                cond: "error",
              },
            ],
          },
        },
        registeringAccount: {
          invoke: {
            id: "registeringAccount",
            src: "registerAccount",
            onDone: [
              {
                target: "addingWidget",
                cond: "success",
              },
              {
                target: "finished",
                cond: "error",
              },
            ],
          },
        },
        addingWidget: {
          invoke: {
            id: "addingWidget",
            src: "addWidget",
            onDone: [
              {
                target: "finished",
                cond: "success",
              },
              {
                target: "finished",
                cond: "error",
              },
            ],
          },
        },
        finished: {
          type: "final",
          data: (context, event) => event.data,
        },
      },
    },
    {
      guards: {
        error: (context, event) => isLeft<Errors.T, any>(event.data),
        success: (context, event) => isRight<Errors.T, any>(event.data),
      },
      services: {
        createPaymentMethod: (context, event) =>
          SendToStripe(stripe, context.formData),
        registerAccount: (context, event) =>
          PostMachineFactory(() => {
            const { right } = event.data as Right<RegisterAccountDTO>;
            return SDK.Account.Register(
              right.paymentMethod,
              right.email,
              right.userName,
              undefined,
              right.accountName,
              right.promoCode
            );
          }),
        addWidget: (context, event) =>
          PostMachineFactory(() =>
            SDK.Widget.Add((event.data as Right<UUID.T>).right, context.widget)
          ),
      },
    }
  );
