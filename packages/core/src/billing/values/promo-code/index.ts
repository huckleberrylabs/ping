import * as iots from "io-ts";
import { NameSpaceCaseString, NonEmptyString } from "../../../values";

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

export type T = iots.TypeOf<typeof Codec>;

export const Is = Codec.is;
