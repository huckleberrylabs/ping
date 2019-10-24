import * as iots from "io-ts";
import { UUID } from "@huckleberryai/core";
import * as Event from "../../../event";

export const Name = "ping:widget:get-by-id";

export const Codec = iots.intersection(
  [iots.type({ type: iots.literal(Name) }), Event.Codec],
  Name
);

export type T = iots.TypeOf<typeof Codec>;

export const C = (widget: UUID.T, corr?: UUID.T): T => ({
  ...Event.C(widget, corr),
  type: Name,
});

export const Is = Codec.is;
