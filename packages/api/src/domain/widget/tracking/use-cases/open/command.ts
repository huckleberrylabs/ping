import * as iots from "io-ts";
import { NameSpaceCaseString, UUID } from "@huckleberrylabs/core";
import { Event } from "../../../../value-objects";

export const Name = "widget:tracking:open" as NameSpaceCaseString.T;

export const Codec = iots.intersection(
  [
    iots.type({
      type: iots.literal(Name),
      widget: UUID.Codec,
    }),
    Event.Codec,
  ],
  Name
);

export type T = iots.TypeOf<typeof Codec>;

export const C = (widget: UUID.T): T => ({
  ...Event.C(),
  widget,
  type: Name,
});

export const Is = Codec.is;
