import * as iots from "io-ts";
import { UUID, EmailAddress, Event } from "@huckleberryai/core";

export const Name = "ping:account:send-login-email";

export const Codec = iots.intersection(
  [
    iots.type({
      type: iots.literal(Name),
      email: EmailAddress.Codec,
    }),
    Event.Codec,
  ],
  Name
);

export type T = iots.TypeOf<typeof Codec>;

export const C = (email: EmailAddress.T, corr?: UUID.T): T => ({
  ...Event.C(corr),
  type: Name,
  email,
});

export const Is = Codec.is;
