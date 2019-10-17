import * as iots from "io-ts";
import { Type, UUID, Phone } from "@huckleberryai/core";
import { Event as Base } from "../base";

export const Name = "widget:command:add-phone-to-message" as Type.T;

export const Codec = iots.intersection([
  Base.Codec,
  iots.type({
    phone: Phone.Codec,
  }),
]);

export type T = iots.TypeOf<typeof Codec>;

export const C = (
  phone: Phone.T,
  message: UUID.T,
  widget: UUID.T,
  corr?: UUID.T,
  parent?: UUID.T
): T => ({ ...Base.C(Name)(message, widget, corr, parent), phone });

export const Is = Codec.is;
