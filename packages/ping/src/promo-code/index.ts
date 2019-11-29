import * as iots from "io-ts";
import { NonEmptyString } from "@huckleberryai/core";
export const Name = "ping:value:promo-code";

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
  HEADSTART: {
    couponID: "B3xAeqrV" as NonEmptyString.T,
    description: "3 Months Free" as NonEmptyString.T,
  },
  SUPPORTER: {
    couponID: "a6IUP4Ms" as NonEmptyString.T,
    description: "30 % off forever" as NonEmptyString.T,
  },
  GIVEAWAY: {
    couponID: "u8x9Eb7i" as NonEmptyString.T,
    description: "15% off for 3 months" as NonEmptyString.T,
  },
};

export const Default: T = "GIVEAWAY";

export type T = iots.TypeOf<typeof Codec>;

export const Is = Codec.is;
