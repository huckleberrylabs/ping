import { pipe } from "fp-ts/lib/pipeable";
import { map, left, right, flatten } from "fp-ts/lib/Either";
import * as iots from "io-ts";
import { GetEnv, UUID, NonEmptyString, Errors } from "@huckleberryai/core";
import * as Event from "../event";
import * as Log from "../log";
import * as Level from "../level";

export const C = (log: Log.T) => (
  level: Level.T,
  message: string,
  tags: string[],
  corr?: UUID.T,
  parent?: UUID.T
): void => {
  pipe(
    NonEmptyString.Codec.is(message)
      ? right(message)
      : left(new Errors.Validation("message cannot be empty")),
    map(message =>
      pipe(
        iots.array(NonEmptyString.Codec).is(tags)
          ? right(tags)
          : left(new Errors.Validation("message cannot be empty")),
        map(tags => Event.C(level, message, tags, corr, parent))
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
