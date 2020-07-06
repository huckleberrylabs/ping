import * as iots from "io-ts";
import { Event, NameSpaceCaseString } from "../../../../values";
import * as Model from "../../model";

export const Name = "messaging:command:contact:create" as NameSpaceCaseString.T;

export const Codec = iots.intersection(
  [
    iots.type({
      type: iots.literal(Name),
      contact: Model.Codec,
    }),
    Event.Codec,
  ],
  Name
);

export type T = iots.TypeOf<typeof Codec>;

export const C = (contact: Model.T): T => ({
  ...Event.C(),
  type: Name,
  contact,
});

export const Is = Codec.is;
