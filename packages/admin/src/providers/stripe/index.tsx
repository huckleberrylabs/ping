import React from "react";
import { StripeProvider as StripeProv } from "react-stripe-elements";

const StripePublicKey = process.env.REACT_APP_STRIPE_PUBLIC_KEY
  ? process.env.REACT_APP_STRIPE_PUBLIC_KEY
  : "pk_test_yoFeO5x15PPlisJIQdFgoWbG005bjq8KtN";

export const StripeProvider = (props: JSX.Element) => (
  <StripeProv apiKey={StripePublicKey}>{props}</StripeProv>
);
