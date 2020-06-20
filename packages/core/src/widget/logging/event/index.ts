import * as iots from "io-ts";
import { NonEmptyString, Event, NameSpaceCaseString } from "../../../values";
import * as Level from "../level";

export const Name = "widget:logging:event:logged" as NameSpaceCaseString.T;

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
  tags: NonEmptyString.T[]
): T => ({
  ...Event.C(),
  type: Name,
  level,
  message,
  tags,
});

export const Is = Codec.is;
