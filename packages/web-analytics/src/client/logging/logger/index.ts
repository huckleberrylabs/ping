import { left, isLeft, right } from "fp-ts/lib/Either";
import * as iots from "io-ts";
import { Env, UUID, NonEmptyString, Errors } from "@huckleberryai/core";
import * as Event from "../event";
import * as Log from "../log";
import * as Level from "../level";

export const C = (log: Log.T) => (
  level: Level.T,
  message: string,
  tags: string[],
  corr?: UUID.T,
  parent?: UUID.T
) => {
  if (!NonEmptyString.Codec.is(message)) return left(Errors.Validation.C());
  if (!iots.array(NonEmptyString.Codec).is(tags))
    return left(Errors.Validation.C());
  const event = Event.C(level, message, tags, corr, parent);
  log.push(event);
  const env = Env.Get();
  if (isLeft(env)) return env;
  if (
    env.right === "development" ||
    env.right === "test" ||
    env.right === "staging"
  ) {
    console.log(
      event.timestamp.toString(),
      event.level,
      event.tags,
      event.message
    );
  }
  return right(true);
};
