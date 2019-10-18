import * as iots from "io-ts";
import { UUID } from "@huckleberryai/core";
import { Event } from "../../../base";

export const Name = "widget:settings:get-by-id";

export const Codec = iots.intersection(
  [iots.type({ type: iots.literal(Name) }), Event.Codec],
  Name
);

export type T = iots.TypeOf<typeof Codec>;

export const C = (widget: UUID.T, corr?: UUID.T, parent?: UUID.T): T => ({
  ...Event.C(widget, corr, parent),
  type: Name,
});
