import * as iots from "io-ts";
import { UUID } from "@huckleberrylabs/core";
import * as Widget from "../../../../widget";
import * as Event from "../../../event";

export const Name = "ping:account:update-widget";

export const Codec = iots.intersection(
  [iots.type({ type: iots.literal(Name), widget: Widget.Codec }), Event.Codec],
  Name
);

export type T = iots.TypeOf<typeof Codec>;

export const C = (account: UUID.T, widget: Widget.T, corr?: UUID.T): T => ({
  ...Event.C(account, corr),
  type: Name,
  widget,
});

export const Is = Codec.is;
