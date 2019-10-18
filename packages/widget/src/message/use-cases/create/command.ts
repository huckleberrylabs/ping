import * as iots from "io-ts";
import { UUID } from "@huckleberryai/core";
import { Event } from "../base";

export const Name = "widget:message:create";

export const Codec = iots.intersection(
  [iots.type({ type: iots.literal(Name) }), Event.Codec],
  Name
);

export type T = iots.TypeOf<typeof Codec>;

export const C = (
  message: UUID.T,
  widget: UUID.T,
  corr?: UUID.T,
  parent?: UUID.T
): T => ({ ...Event.C(message, widget, corr, parent), type: Name });

export const Is = Codec.is;
