import * as iots from "io-ts";
import { UUID } from "@huckleberryai/core";
import * as Event from "../../../event";

export const Name = "ping:message:send";

export const Codec = iots.intersection(
  [iots.type({ type: iots.literal(Name) }), Event.Codec],
  Name
);

export type T = iots.TypeOf<typeof Codec>;

export const C = (message: UUID.T, widget: UUID.T, corr?: UUID.T): T => ({
  ...Event.C(message, widget, corr),
  type: Name,
});

export const Is = Codec.is;
