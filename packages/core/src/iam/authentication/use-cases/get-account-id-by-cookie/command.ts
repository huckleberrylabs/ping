import * as iots from "io-ts";
import { Event, NameSpaceCaseString } from "../../../../values";

export const Name = "auth:command:get-account-id-by-cookie" as NameSpaceCaseString.T;

export const Codec = iots.intersection(
  [iots.type({ type: iots.literal(Name) }), Event.Codec],
  Name
);

export type T = iots.TypeOf<typeof Codec>;

export const C = (): T => ({
  ...Event.C(),
  type: Name,
});

export const Is = Codec.is;
