import * as iots from "io-ts";
import { UUID, Event } from "@huckleberryai/core";

export const Name = "ping:abstract-account-event";

export const Codec = iots.intersection(
  [
    iots.type({
      account: UUID.Codec,
    }),
    Event.Codec,
  ],
  Name
);

export type T = iots.TypeOf<typeof Codec>;

export const C = (account: UUID.T, corr?: UUID.T): T => ({
  ...Event.C(corr),
  account,
});

export const Is = Codec.is;
