import * as iots from "io-ts";
import { Event, NonEmptyString, NameSpaceCaseString } from "../../../../values";

export const Name = "auth:command:login-with-token" as NameSpaceCaseString.T;

export const Codec = iots.intersection(
  [
    iots.type({
      type: iots.literal(Name),
      token: NonEmptyString.Codec,
    }),
    Event.Codec,
  ],
  Name
);

export type T = iots.TypeOf<typeof Codec>;

export const C = (token: NonEmptyString.T): T => ({
  ...Event.C(),
  type: Name,
  token,
});

export const Is = Codec.is;
