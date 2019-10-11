import { pipe } from "fp-ts/lib/pipeable";
import * as iots from "io-ts";
import { Type, UUID } from "@huckleberryai/core";
import { Event as Base } from "../../../base";

export const Codec = iots.intersection([
  Base.Codec,
  iots.type({
    message: UUID.Codec,
  }),
]);

export type T = iots.TypeOf<typeof Codec>;

export const C = (type: Type.T) => (
  message: UUID.T,
  widget: UUID.T,
  corr?: UUID.T,
  parent?: UUID.T
): T =>
  pipe(
    Base.C(type)(widget, corr, parent),
    event => ({ ...event, message })
  );

export const Is = Codec.is;
