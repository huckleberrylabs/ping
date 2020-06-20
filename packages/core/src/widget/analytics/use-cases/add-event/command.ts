import * as iots from "io-ts";
import { NameSpaceCaseString, UUID, Event } from "../../../../values";

export const Name = "widget:analytics:command:add-event" as NameSpaceCaseString.T;

export const Codec = iots.intersection(
  [
    iots.type({
      type: iots.literal(Name),
      widget: UUID.Codec,
      action: UUID.Codec,
    }),
    Event.Codec,
  ],
  Name
);

export type T = iots.TypeOf<typeof Codec>;

export const C = (widget: UUID.T, action: UUID.T): T => ({
  ...Event.C(),
  widget,
  action,
  type: Name,
});

export const Is = Codec.is;
