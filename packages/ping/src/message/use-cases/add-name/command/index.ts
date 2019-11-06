import * as iots from "io-ts";
import { UUID, PersonName } from "@huckleberryai/core";
import * as Event from "../../../event";

export const Name = "ping:message:add-name";

export const Codec = iots.intersection(
  [
    iots.type({
      type: iots.literal(Name),
      name: PersonName.Codec,
    }),
    Event.Codec,
  ],
  Name
);

export type T = iots.TypeOf<typeof Codec>;

export const C = (
  name: PersonName.T,
  message: UUID.T,
  widget: UUID.T,
  corr?: UUID.T
): T => ({ ...Event.C(message, widget, corr), type: Name, name });

export const Is = Codec.is;
