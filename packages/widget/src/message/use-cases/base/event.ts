import * as iots from "io-ts";
import { UUID } from "@huckleberryai/core";
import { Event } from "../../../base";

export const Name = "widget:message:abstract:event";
export const Codec = iots.intersection(
  [
    iots.type({
      message: UUID.Codec,
    }),
    Event.Codec,
  ],
  Name
);

export type T = iots.TypeOf<typeof Codec>;

export const C = (
  message: UUID.T,
  widget: UUID.T,
  corr?: UUID.T,
  parent?: UUID.T
): T => ({ ...Event.C(widget, corr, parent), message });

export const Is = Codec.is;
