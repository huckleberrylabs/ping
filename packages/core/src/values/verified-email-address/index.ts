import * as iots from "io-ts";
import * as NameSpaceCaseString from "../namespace-case-string";
import * as EmailAddress from "../email-address";

export const Name = "value:verified-email-address" as NameSpaceCaseString.T;

export const Codec = iots.type(
  {
    type: iots.literal(Name),
    email: EmailAddress.Codec,
    verified: iots.boolean,
  },
  Name
);

export type T = iots.TypeOf<typeof Codec>;

export const C = (email: EmailAddress.T): T => ({
  email,
  verified: false,
  type: Name,
});

export const Is = Codec.is;
