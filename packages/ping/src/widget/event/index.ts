import * as iots from "io-ts";
import { UUID, Event } from "@huckleberrylabs/core";

export const Name = "ping:abstract-widget-event";
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

export const C = (widget: UUID.T, corr?: UUID.T): T => ({
  ...Event.C(corr),
  widget,
});

export const Is = Codec.is;
