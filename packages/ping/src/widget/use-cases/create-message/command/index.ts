import * as iots from "io-ts";
import { UUID } from "@huckleberrylabs/core";
import * as Event from "../../../../message/event";

export const Name = "ping:widget:create-message";

export const Codec = iots.intersection(
  [iots.type({ type: iots.literal(Name) }), Event.Codec],
  Name
);

export type T = iots.TypeOf<typeof Codec>;

export const C = (widget: UUID.T, corr?: UUID.T): T => ({
  ...Event.C(UUID.C(), widget, corr),
  type: Name,
});

export const Is = Codec.is;
