import * as iots from "io-ts";
import { UUID, Event, NameSpaceCaseString } from "../../../../values";

export const Name = "messaging:query:contact:get-by-id" as NameSpaceCaseString.T;

export const Codec = iots.intersection(
  [iots.type({ type: iots.literal(Name), contact: UUID.Codec }), Event.Codec],
  Name
);

export type T = iots.TypeOf<typeof Codec>;

export const C = (contact: UUID.T): T => ({
  ...Event.C(),
  contact,
  type: Name,
});

export const Is = Codec.is;
