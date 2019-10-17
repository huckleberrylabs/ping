import * as iots from "io-ts";
import { UUID, Type, NonEmptyString } from "@huckleberryai/core";
import { Event as Base } from "../base";

export const Name = "widget:command:add-text-to-message" as Type.T;

export const Codec = iots.intersection([
  Base.Codec,
  iots.type({
    text: NonEmptyString.Codec,
  }),
]);

export type T = iots.TypeOf<typeof Codec>;

export const C = (
  text: NonEmptyString.T,
  message: UUID.T,
  widget: UUID.T,
  corr?: UUID.T,
  parent?: UUID.T
): T => ({ ...Base.C(Name)(message, widget, corr, parent), text });

export const Is = Codec.is;
