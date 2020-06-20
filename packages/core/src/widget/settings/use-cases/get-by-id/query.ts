import * as iots from "io-ts";
import { UUID, Event, NameSpaceCaseString } from "../../../../values";

export const Name = "widget:query:get-by-id" as NameSpaceCaseString.T;

export const Codec = iots.intersection(
  [iots.type({ type: iots.literal(Name), widget: UUID.Codec }), Event.Codec],
  Name
);

export type T = iots.TypeOf<typeof Codec>;

export const C = (widget: UUID.T): T => ({
  ...Event.C(),
  widget,
  type: Name,
});

export const Is = Codec.is;
