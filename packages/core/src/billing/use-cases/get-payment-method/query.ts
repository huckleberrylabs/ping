import * as iots from "io-ts";
import { Either, fold, left, right } from "fp-ts/lib/Either";
import { Event, NameSpaceCaseString, Errors, UUID } from "../../../values";
import { DecodeErrorFormatter } from "../../../logging";
import { CustomerID } from "../../values";

export const Name = "query:billing:customer:get-payment-method" as NameSpaceCaseString.T;

export const Codec = iots.intersection(
  [
    iots.type({
      type: iots.literal(Name),
      customer: CustomerID.Codec,
      account: UUID.Codec,
    }),
    Event.Codec,
  ],
  Name
);
export const Is = Codec.is;
export const Decode = (value: unknown) =>
  fold<iots.Errors, T, Either<Errors.Validation.T, T>>(
    errors =>
      left(
        Errors.Validation.C(Name, `Decode: ${DecodeErrorFormatter(errors)}`)
      ),
    decoded => right(decoded)
  )(Codec.decode(value));
export const Encode = Codec.encode;
export type T = iots.TypeOf<typeof Codec>;
export const C = (customer: CustomerID.T, account: UUID.T): T => ({
  ...Event.C(),
  customer,
  account,
  type: Name,
});
