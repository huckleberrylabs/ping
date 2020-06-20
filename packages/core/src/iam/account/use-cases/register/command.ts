import * as iots from "io-ts";
import {
  Event,
  EmailAddress,
  PersonName,
  NameSpaceCaseString,
} from "../../../../values";

export const Name = "auth:command:account:register" as NameSpaceCaseString.T;

export const Codec = iots.intersection(
  [
    iots.type({
      type: iots.literal(Name),
      name: PersonName.Codec,
      email: EmailAddress.Codec,
    }),
    Event.Codec,
  ],
  Name
);

export type T = iots.TypeOf<typeof Codec>;

export const C = (email: EmailAddress.T, name: PersonName.T): T => ({
  ...Event.C(),
  type: Name,
  email,
  name,
});

export const Is = Codec.is;
