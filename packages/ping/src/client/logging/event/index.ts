import * as iots from "io-ts";
import { UUID, NonEmptyString } from "@huckleberryai/core";
import { Event } from "../../base";
import * as Level from "../level";

export const Name = "web-analytics:client:logged";

export const Codec = iots.intersection(
  [
    iots.type({
      type: iots.literal(Name),
      level: Level.Codec,
      message: NonEmptyString.Codec,
      tags: iots.array(NonEmptyString.Codec),
    }),
    Event.Codec,
  ],
  Name
);

export type T = iots.TypeOf<typeof Codec>;

export const C = (
  level: Level.T,
  message: NonEmptyString.T,
  tags: NonEmptyString.T[],
  app?: UUID.T,
  corr?: UUID.T,
  parent?: UUID.T
): T => ({
  ...Event.C(app, corr, parent),
  type: Name,
  level,
  message,
  tags,
});

export const Is = Codec.is;
