import * as iots from "io-ts";
import { Event, NameSpaceCaseString } from "../../../../values";
import * as Model from "../../model";

export const Name = "widget:command:update" as NameSpaceCaseString.T;

export const Codec = iots.intersection(
  [
    iots.type({
      type: iots.literal(Name),
      widget: Model.Codec,
    }),
    Event.Codec,
  ],
  Name
);

export type T = iots.TypeOf<typeof Codec>;

export const C = (widget: Model.T): T => ({
  ...Event.C(),
  type: Name,
  widget,
});

export const Is = Codec.is;
