import { Machine, assign } from "xstate";
import { Widget } from "@huckleberryai/ping";

interface RegisterAccountMachineContext {
  widget: undefined | Widget.T;
  stage: number;
}

export const RegisterAccountMachine = Machine<RegisterAccountMachineContext>(
  {
    id: "ping:register-account",
    initial: "createWidget",
    context: {
      widget: undefined,
      stage: 1
    },
    states: {
      createWidget: {
        on: {
          NEXT: {
            target: "createAccount",
            actions: ["setWidget"]
          }
        },
        entry: assign((context, event) => ({ stage: 1 }))
      },
      createAccount: {
        on: {
          CREATE: {
            target: "creatingAccount"
          },
          BACK: {
            target: "createWidget"
          }
        },
        entry: assign((context, event) => ({ stage: 2 }))
      },
      creatingAccount: {},
      accountCreated: {
        type: "final"
      }
    }
  },
  {
    actions: {
      setWidget: assign((context, event) => ({ widget: event.value }))
    }
  }
);
