import { pipe } from "fp-ts/lib/pipeable";
import { Either, map, left, right, flatten } from "fp-ts/lib/Either";
import * as iots from "io-ts";
import {
  UUID,
  Event,
  EventCodec,
  Type,
  NonEmptyStringCodec,
} from "@huckleberryai/core";
import { ValidationError } from "@huckleberryai/core/lib/errors";

export const LogEntryEventType = "log:event:entry" as Type;

const LogLevelCodec = iots.union([
  iots.literal("critical"),
  iots.literal("error"),
  iots.literal("debug"),
  iots.literal("info"),
]);

export type LogLevel = iots.TypeOf<typeof LogLevelCodec>;

export const LogEntryEventCodec = iots.intersection(
  [
    EventCodec,
    iots.type({
      message: NonEmptyStringCodec,
      level: LogLevelCodec,
      tags: iots.array(NonEmptyStringCodec),
    }),
  ],
  LogEntryEventType
);

export type LogEntryEvent = iots.TypeOf<typeof LogEntryEventCodec>;

export const LogEntryEvent = (
  message: string,
  level: LogLevel,
  tags: string[],
  origin: Type,
  corr?: UUID,
  parent?: UUID
): Either<Error, LogEntryEvent> =>
  pipe(
    Event(LogEntryEventType, origin, corr, parent),
    map(event => ({
      ...event,
      level,
    })),
    map(event =>
      NonEmptyStringCodec.is(message)
        ? right({ ...event, message })
        : left(new ValidationError("message cannot be empty"))
    ),
    flatten,
    map(event =>
      iots.array(NonEmptyStringCodec).is(tags)
        ? right({ ...event, tags })
        : left(new ValidationError("tags cannot be empty"))
    ),
    flatten
  );
