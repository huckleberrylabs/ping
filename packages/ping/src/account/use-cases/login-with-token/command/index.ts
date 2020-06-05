import * as iots from "io-ts";
import { UUID, Event, NonEmptyString } from "@huckleberrylabs/core";

export const Name = "ping:account:login-with-token";

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

export const C = (token: NonEmptyString.T, corr?: UUID.T): T => ({
  ...Event.C(corr),
  type: Name,
  token,
});

export const Is = Codec.is;
