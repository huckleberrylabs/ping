import * as iots from "io-ts";
import * as Event from "../event";
import * as Log from "../log";
import * as Level from "../level";
import { isSome } from "fp-ts/lib/Option";

export const DecodeErrorParser = (errors: iots.Errors) =>
  errors.map(err => ({
    key: err.context.map(ctx => ctx.key).join("."),
    value: err.context[err.context.length - 1].actual,
  }));

export const DecodeErrorFormatter = (errors: iots.Errors) =>
  DecodeErrorParser(errors)
    .map(error => `key ${error.key} with value ${error.value} `)
    .join(",");

export const C = (log: Log.T, printToConsole: boolean) => (
  origin: string,
  level: Level.T,
  message?: string,
  tags?: string[]
): void => {
  const event = Event.C({ origin, level, message, tags });
  log.push(event);
  if (printToConsole) {
    console.log(
      event.timestamp.toString(),
      event.origin,
      event.level,
      isSome(event.message) ? event.message.value : "",
      event.tags.length > 0 ? event.tags : ""
    );
  }
};
