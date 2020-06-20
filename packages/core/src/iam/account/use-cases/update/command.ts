import * as iots from "io-ts";
import {
  UUID,
  Event,
  PersonName,
  EmailAddress,
  NameSpaceCaseString,
} from "../../../../values";

export const Name = "auth:command:account:update" as NameSpaceCaseString.T;

export const Codec = iots.intersection(
  [
    iots.type({
      type: iots.literal(Name),
      account: UUID.Codec,
      email: EmailAddress.Codec,
      name: PersonName.Codec,
    }),
    Event.Codec,
  ],
  Name
);

export type T = iots.TypeOf<typeof Codec>;

export const C = (
  account: UUID.T,
  email: EmailAddress.T,
  name: PersonName.T
): T => ({
  ...Event.C(),
  type: Name,
  account,
  email,
  name,
});

export const Is = Codec.is;
