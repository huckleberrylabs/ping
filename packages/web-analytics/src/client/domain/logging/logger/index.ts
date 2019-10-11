import { pipe } from "fp-ts/lib/pipeable";
import { map, left, right, flatten } from "fp-ts/lib/Either";
import * as iots from "io-ts";
import {
  GetEnv,
  UUID,
  NonEmptyStringCodec,
  ValidationError,
} from "@huckleberryai/core";
import { LogEvent } from "../event";
import { Log } from "../log";
import { LogLevel } from "../level";

export const Logger = (log: Log) => (
  level: LogLevel,
  message: string,
  tags: string[],
  corr?: UUID,
  parent?: UUID
): void => {
  pipe(
    NonEmptyStringCodec.is(message)
      ? right(message)
      : left(new ValidationError("message cannot be empty")),
    map(message =>
      pipe(
        iots.array(NonEmptyStringCodec).is(tags)
          ? right(tags)
          : left(new ValidationError("message cannot be empty")),
        map(tags => LogEvent(level, message, tags, corr, parent))
      )
    ),
    flatten,
    map(logEvent => {
      log.push(logEvent);
      pipe(
        GetEnv(),
        map(
          env => env === "development" || env === "test" || env === "staging"
        ),
        map(notProd =>
          notProd
            ? console.log(
                logEvent.timestamp.toString(),
                logEvent.level,
                logEvent.tags,
                logEvent.message
              )
            : null
        )
      );
    })
  );
};
