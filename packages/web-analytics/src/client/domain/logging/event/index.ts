import { pipe } from "fp-ts/lib/pipeable";
import * as iots from "io-ts";
import {
  Type,
  UUID,
  NonEmptyString,
  NonEmptyStringCodec,
} from "@huckleberryai/core";
import { ClientEvent, ClientEventCodec } from "../../../base";
import { LogLevelCodec, LogLevel } from "../level";

export const LogEventType = "web-analytics:event:log" as Type;

export const LogEventCodec = iots.intersection(
  [
    ClientEventCodec,
    iots.type({
      level: LogLevelCodec,
      message: NonEmptyStringCodec,
      tags: iots.array(NonEmptyStringCodec),
    }),
  ],
  LogEventType
);

export type LogEvent = iots.TypeOf<typeof LogEventCodec>;

export const LogEvent = (
  level: LogLevel,
  message: NonEmptyString,
  tags: NonEmptyString[],
  app?: UUID,
  corr?: UUID,
  parent?: UUID
): LogEvent =>
  pipe(
    ClientEvent(LogEventType)(app, corr, parent),
    event => ({
      ...event,
      level,
      message,
      tags,
    })
  );
