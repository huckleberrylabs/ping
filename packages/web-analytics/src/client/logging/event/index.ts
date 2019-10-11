import { pipe } from "fp-ts/lib/pipeable";
import * as iots from "io-ts";
import { Type, UUID, NonEmptyString } from "@huckleberryai/core";
import * as Base from "../../base";
import * as Level from "../level";

export const Name = "web-analytics:event:log" as Type.T;

export const Codec = iots.intersection(
  [
    Base.Event.Codec,
    iots.type({
      level: Level.Codec,
      message: NonEmptyString.Codec,
      tags: iots.array(NonEmptyString.Codec),
    }),
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
): T =>
  pipe(
    Base.Event.C(Name)(app, corr, parent),
    event => ({
      ...event,
      level,
      message,
      tags,
    })
  );
