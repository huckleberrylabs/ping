import * as iots from "io-ts";
import * as EmailAddress from "../email-address";
import * as NameSpaceCaseString from "../namespace-case-string";

export const Name = "value:verified-email-address" as NameSpaceCaseString.T;

export const Codec = iots.type(
  {
    address: EmailAddress.Codec,
    verified: iots.boolean,
  },
  Name
);

export type T = iots.TypeOf<typeof Codec>;

export const C = (address: EmailAddress.T): T => ({
  address,
  verified: false,
});

export const Is = Codec.is;
