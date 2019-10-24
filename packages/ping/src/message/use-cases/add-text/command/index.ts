import * as iots from "io-ts";
import { UUID, NonEmptyString } from "@huckleberryai/core";
import * as Event from "../../../event";

export const Name = "ping:message:add-text";

export const Codec = iots.intersection(
  [
    iots.type({
      type: iots.literal(Name),
      text: NonEmptyString.Codec,
    }),
    Event.Codec,
  ],
  Name
);

export type T = iots.TypeOf<typeof Codec>;

export const C = (
  text: NonEmptyString.T,
  message: UUID.T,
  widget: UUID.T,
  corr?: UUID.T
): T => ({ ...Event.C(message, widget, corr), type: Name, text });

export const Is = Codec.is;
