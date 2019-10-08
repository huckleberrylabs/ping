import { pipe } from "fp-ts/lib/pipeable";
import { map } from "fp-ts/lib/Either";
import * as t from "io-ts";
import { GetEnv, UUID, Type } from "@huckleberryai/core";
import {
  LogEntryEvent,
  LogLevel,
  LogEntryEventCodec,
} from "../log-entry-event";

export const LogCodec = t.array(LogEntryEventCodec);

export type Log = t.TypeOf<typeof LogCodec>;

export const Log = (): Log => [];

export type Logger = (
  log: Log
) => (
  message: string,
  level: LogLevel,
  tags: string[],
  origin: Type,
  corr?: UUID,
  parent?: UUID
) => void;

export const Logger: Logger = (log: Log) => (
  message,
  level,
  tags,
  origin,
  corr,
  parent
) => {
  pipe(
    LogEntryEvent(message, level, tags, origin, corr, parent),
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
