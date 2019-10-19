import * as iots from "io-ts";
import { UUID, Event } from "@huckleberryai/core";

export const Name = "widget:abstract:event";
export const Codec = iots.intersection(
  [
    iots.type({
      widget: UUID.Codec,
    }),
    Event.Codec,
  ],
  Name
);

export type T = iots.TypeOf<typeof Codec>;

export const C = (widget: UUID.T, corr?: UUID.T, parent?: UUID.T): T => ({
  ...Event.C(corr, parent),
  widget,
});

export const Is = Codec.is;
