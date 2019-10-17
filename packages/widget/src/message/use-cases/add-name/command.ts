import * as iots from "io-ts";
import { Type, UUID, PersonName } from "@huckleberryai/core";
import { Event as Base } from "../base";

export const Name = "widget:command:add-name-to-message" as Type.T;

export const Codec = iots.intersection([
  Base.Codec,
  iots.type({
    name: PersonName.Codec,
  }),
]);

export type T = iots.TypeOf<typeof Codec>;

export const C = (
  name: PersonName.T,
  message: UUID.T,
  widget: UUID.T,
  corr?: UUID.T,
  parent?: UUID.T
): T => ({ ...Base.C(Name)(message, widget, corr, parent), name });

export const Is = Codec.is;
