import { left, right } from "fp-ts/lib/Either";
import * as iots from "io-ts";
import { NonEmptyString, Errors, Env } from "../../../values";
import * as Event from "../event";
import * as Log from "../log";
import * as Level from "../level";
import { ILogger } from "../../../interfaces";

export const C = (log: Log.T): ILogger => (
  level: Level.T,
  message: string,
  tags: string[]
) => {
  if (!NonEmptyString.Codec.is(message)) return left(Errors.Validation.C());
  if (!iots.array(NonEmptyString.Codec).is(tags))
    return left(Errors.Validation.C());
  const event = Event.C(level, message, tags);
  log.push(event);
  const env = Env.Get();
  if (env === "development" || env === "test" || env === "staging") {
    console.log(
      event.timestamp.toString(),
      event.level,
      event.tags,
      event.message
    );
  }
  return right(true);
};
