import * as iots from "io-ts";
import { EmailAddress, Event, NameSpaceCaseString } from "../../../../values";

export const Name = "auth:command:send-login-email" as NameSpaceCaseString.T;

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

export const C = (email: EmailAddress.T): T => ({
  ...Event.C(),
  type: Name,
  email,
});

export const Is = Codec.is;
