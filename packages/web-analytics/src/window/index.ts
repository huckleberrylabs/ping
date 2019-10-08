import { map } from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/pipeable";
import { GetContext, GetENV, GetRuntime } from "@huckleberryai/core";
import { Log, Logger } from "@huckleberryai/log";

export const AttachToWindow = (log: Log, logger: Logger) => 
  pipe(
    GetContext(),
    map(context =>
      pipe(
        GetENV(),
        map(env =>
          pipe(
            GetRuntime(),
            map(runtime => pipe(map(() => {
              const ORIGIN_ID = "c857c895-40b7-41ca-ae27-a04e34274298";
              const { HUCKLEBERRY } = runtime === "browser" ? (window as any) : global;
              HUCKLEBERRY.CONTEXT_ID = context;
              HUCKLEBERRY.ENV = env;
              HUCKLEBERRY.RUNTIME = runtime;
              logger(`CONTEXT_ID: ${context}`, "info", ["web-analytics"], ORIGIN_ID);
              logger(`ENV: ${env}`, "info", ["web-analytics"], ORIGIN_ID);
              logger(`RUNTIME: ${runtime}`, "info", ["web-analytics"], ORIGIN_ID);
              HUCKLEBERRY.log
            }))
          )
        )
      )
    )
  )
;
