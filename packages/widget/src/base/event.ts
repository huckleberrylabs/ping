import { pipe } from "fp-ts/lib/pipeable";
import * as iots from "io-ts";
import { Type, UUID, Event as Base } from "@huckleberryai/core";

export const Codec = iots.intersection([
  Base.Codec,
  iots.type({
    widget: UUID.Codec,
  }),
]);

export type T = iots.TypeOf<typeof Codec>;

export const C = (type: Type.T) => (
  widget: UUID.T,
  corr?: UUID.T,
  parent?: UUID.T
): T =>
  pipe(
    Base.C(type, corr, parent),
    event => ({
      ...event,
      widget,
    })
  );
