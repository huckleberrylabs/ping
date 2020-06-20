import * as iots from "io-ts";
import {
  UUID,
  TimeStamp,
  PersonName,
  EmailAddress,
  NameSpaceCaseString,
  VerifiedEmailAddress,
} from "../../../values";

export const Name = "auth:model:account" as NameSpaceCaseString.T;

export const Codec = iots.type(
  {
    type: iots.literal(Name),
    id: UUID.Codec,
    registeredAt: TimeStamp.Codec,
    name: PersonName.Codec,
    email: VerifiedEmailAddress.Codec,
  },
  Name
);

export type T = iots.TypeOf<typeof Codec>;

export const C = (email: EmailAddress.T, name: PersonName.T): T => ({
  type: Name,
  registeredAt: TimeStamp.C(),
  id: UUID.C(),
  email: VerifiedEmailAddress.C(email),
  name,
});

export const Is = Codec.is;
