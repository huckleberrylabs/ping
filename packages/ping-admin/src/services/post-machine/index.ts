import { Machine, assign } from "xstate";
import { Either, isLeft } from "fp-ts/lib/Either";
import { Errors } from "@huckleberryai/core";

export interface PostMachineContext {
  tries: number;
  result: undefined | Either<Errors.T, any>;
}

export const PostMachineFactory = (
  apiCall: () => Promise<Either<Errors.T, any>>
) =>
  Machine<PostMachineContext>(
    {
      id: "post",
      initial: "posting",
      context: {
        tries: 1,
        result: undefined
      },
      states: {
        posting: {
          invoke: {
            id: "post-data",
            src: apiCall,
            onDone: [
              {
                target: "retry",
                actions: ["incrementRetries", "setResult"],
                cond: "canRetry"
              },
              {
                target: "posted",
                actions: ["setResult"]
              }
            ]
          }
        },
        retry: {
          after: {
            BACK_OFF: "posting"
          }
        },
        posted: {
          type: "final",
          data: context => context.result
        }
      }
    },
    {
      actions: {
        incrementRetries: assign(context => ({
          tries: context.tries + 1
        })),
        setResult: assign((context, event) => ({
          result: event.data
        }))
      },
      guards: {
        canRetry: (context, event) =>
          context.tries < 3 &&
          isLeft(event.data) &&
          Errors.Adapter.Is(event.data.left)
      },
      delays: {
        BACK_OFF: context => 350 * context.tries * context.tries
      }
    }
  );
