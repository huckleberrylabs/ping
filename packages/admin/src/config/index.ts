import { Color, Country, Icon } from "@huckleberrylabs/ping-core";

export const StripKey = process.env.REACT_APP_STRIPE_PUBLIC_KEY
  ? process.env.REACT_APP_STRIPE_PUBLIC_KEY
  : "pk_test_yoFeO5x15PPlisJIQdFgoWbG005bjq8KtN";

export const DefaultCountry = "CA" as Country.T;
export const DefaultColor = "#0087ff" as Color.T;
export const DefaultIcon = 1 as Icon.T;
