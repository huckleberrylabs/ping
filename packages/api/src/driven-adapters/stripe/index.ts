// @ts-ignore
import * as iots from "io-ts";
// @ts-ignore
import { Option } from "fp-ts/lib/Option";

import Stripe from "stripe";
import { left, right, Either } from "fp-ts/lib/Either";
import { Errors } from "@huckleberryai/core";

export type T = Stripe;

export const C = (): Either<Errors.Environment.T, T> => {
  const key = process.env.STRIPE_SECRET_KEY;
  if (key) {
    try {
      const stripe = new Stripe(key);
      stripe.setTimeout(20000);
      stripe.setMaxNetworkRetries(3);
      return right(stripe);
    } catch (error) {
      return left(Errors.Environment.C());
    }
  }
  return left(Errors.Environment.C());
};
