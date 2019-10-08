import { pipe } from "fp-ts/lib/pipeable";
import { Either, map } from "fp-ts/lib/Either";
import * as t from "io-ts";
import "io-ts-types";
import { NonEmptyString } from "io-ts-types/lib/NonEmptyString";
import { UUID, Event, EventCodec, Type } from "@huckleberryai/core";

export const LogEntryEventType = "log-entry-event" as Type;

const LogLevelCodec = t.union([
  t.literal("critical"),
  t.literal("error"),
  t.literal("debug"),
  t.literal("info"),
]);

export type LogLevel = t.TypeOf<typeof LogLevelCodec>;

export const LogEntryEventCodec = t.intersection(
  [
    EventCodec,
    t.type({
      message: NonEmptyString,
      level: LogLevelCodec,
      tags: t.array(NonEmptyString),
    }),
  ],
  LogEntryEventType
);

export type LogEntryEvent = t.TypeOf<typeof LogEntryEventCodec>;

export const LogEntryEvent = (
  message: NonEmptyString,
  level: LogLevel,
  tags: NonEmptyString[],
  origin: UUID,
  corr?: UUID,
  parent?: UUID
): Either<Error, LogEntryEvent> =>
  pipe(
    Event(LogEntryEventType, origin, corr, parent),
    map(event => ({
      ...event,
      message,
      level,
      tags,
    }))
  );
