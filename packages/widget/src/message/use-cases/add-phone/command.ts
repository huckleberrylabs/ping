import * as iots from "io-ts";
import { UUID, Phone } from "@huckleberryai/core";
import { Event } from "../base";

export const Name = "widget:message:add-phone";

export const Codec = iots.intersection(
  [
    iots.type({
      type: iots.literal(Name),
      phone: Phone.Codec,
    }),
    Event.Codec,
  ],
  Name
);

export type T = iots.TypeOf<typeof Codec>;

export const C = (
  phone: Phone.T,
  message: UUID.T,
  widget: UUID.T,
  corr?: UUID.T,
  parent?: UUID.T
): T => ({ ...Event.C(message, widget, corr, parent), type: Name, phone });

export const Is = Codec.is;
