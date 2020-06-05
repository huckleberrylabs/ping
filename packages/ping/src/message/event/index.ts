import * as iots from "io-ts";
import { UUID } from "@huckleberrylabs/core";
import * as Event from "../../widget/event";

export const Name = "ping:abstract-message-event";
export const Codec = iots.intersection(
  [
    iots.type({
      message: UUID.Codec,
    }),
    Event.Codec,
  ],
  Name
);

export type T = iots.TypeOf<typeof Codec>;

export const C = (message: UUID.T, widget: UUID.T, corr?: UUID.T): T => ({
  ...Event.C(widget, corr),
  message,
});

export const Is = Codec.is;
