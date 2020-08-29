import * as iots from "io-ts";
import { Either, fold, left, right } from "fp-ts/lib/Either";
import * as EmailAddress from "../email-address";
import * as NameSpaceCaseString from "../namespace-case-string";
import * as Errors from "../errors";
import { DecodeErrorFormatter } from "../../logging";

export const Name = "value:verified-email-address" as NameSpaceCaseString.T;
export const Codec = iots.type(
  {
    address: EmailAddress.Codec,
    verified: iots.boolean,
  },
  Name
);
export const Decode = (value: unknown) =>
  fold<iots.Errors, T, Either<Errors.Validation.T, T>>(
    errors =>
      left(
        Errors.Validation.C(Name, `Decode: ${DecodeErrorFormatter(errors)}`)
      ),
    decoded => right(decoded)
  )(Codec.decode(value));
export const Encode = Codec.encode;
export const Is = Codec.is;
export type T = iots.TypeOf<typeof Codec>;
export const C = (address: EmailAddress.T): T => ({
  address,
  verified: false,
});
