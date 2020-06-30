import * as iots from "io-ts";
import * as NameSpaceCaseString from "../namespace-case-string";
import * as Phone from "../phone";
import * as Country from "../country";

export const Name = "value:phone-with-county" as NameSpaceCaseString.T;

export const Codec = iots.type(
  {
    country: Country.Codec,
    phone: Phone.Codec,
  },
  Name
);

export type T = iots.TypeOf<typeof Codec>;

export const C = (phone: Phone.T, country: Country.T): T => ({
  phone,
  country,
});

export const Is = Codec.is;
