import * as iots from "io-ts";
import { Event, NameSpaceCaseString, UUID } from "../../../values";

export const Name = "widget:event:created" as NameSpaceCaseString.T;

export const Codec = iots.intersection(
  [
    iots.type({
      type: iots.literal(Name),
      account: UUID.Codec,
      widget: UUID.Codec,
    }),
    Event.Codec,
  ],
  Name
);

export type T = iots.TypeOf<typeof Codec>;

export const C = (account: UUID.T, widget: UUID.T): T => ({
  ...Event.C(),
  account,
  widget,
  type: Name,
});

export const Is = Codec.is;
