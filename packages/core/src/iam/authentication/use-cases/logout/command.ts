import * as iots from "io-ts";
import { UUID, Event, NameSpaceCaseString } from "../../../../values";

export const Name = "auth:command:logout" as NameSpaceCaseString.T;

export const Codec = iots.intersection(
  [iots.type({ type: iots.literal(Name), account: UUID.Codec }), Event.Codec],
  Name
);

export type T = iots.TypeOf<typeof Codec>;

export const C = (account: UUID.T): T => ({
  ...Event.C(),
  account,
  type: Name,
});

export const Is = Codec.is;
