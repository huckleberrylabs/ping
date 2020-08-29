import * as iots from "io-ts";
import { NameSpaceCaseString, NonEmptyString, Errors } from "../../../values";
import { Either, fold, left, right } from "fp-ts/lib/Either";
import { DecodeErrorFormatter } from "../../../logging";

export const Name = "billing:value:promo-code" as NameSpaceCaseString.T;

export const Codec = iots.union(
  [
    iots.literal("HELPINGHAND"),
    iots.literal("HEADSTART"),
    iots.literal("SUPPORTER"),
    iots.literal("GIVEAWAY"),
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

type CouponMap = {
  [P in T]: {
    couponID: NonEmptyString.T;
    description: NonEmptyString.T;
  };
};
export const ToCoupon: CouponMap = {
  HELPINGHAND: {
    couponID: "HvYlvfSS" as NonEmptyString.T,
    description: "100 % off forever" as NonEmptyString.T,
  },
  SUPPORTER: {
    couponID: "a6IUP4Ms" as NonEmptyString.T,
    description: "30 % off forever" as NonEmptyString.T,
  },
  HEADSTART: {
    couponID: "H6YpI0Nk" as NonEmptyString.T,
    description: "30% off for 1 year" as NonEmptyString.T,
  },
  GIVEAWAY: {
    couponID: "xyODByWb" as NonEmptyString.T,
    description: "15% off for 1 year" as NonEmptyString.T,
  },
};
export const Default: T = "GIVEAWAY";
