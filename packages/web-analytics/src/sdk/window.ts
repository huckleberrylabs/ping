import { map } from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/pipeable";
import { GetEnv, GetRuntime } from "@huckleberryai/core";
import { Log } from "../client";
import { Logger as ILogger } from "../interfaces";

export const AttachToWindow = (log: Log, logger: ILogger) =>
  pipe(
    GetEnv(),
    map(env =>
      pipe(
        GetRuntime(),
        map(runtime =>
          pipe(
            map(() => {
              const { HUCKLEBERRY } =
                runtime === "browser" ? (window as any) : global;
              HUCKLEBERRY.ENV = env;
              HUCKLEBERRY.RUNTIME = runtime;
              HUCKLEBERRY.log = log;
              logger("info", `ENV: ${env}`, ["web-analytics"]);
              logger("info", `RUNTIME: ${runtime}`, ["web-analytics"]);
            })
          )
        )
      )
    )
  );
