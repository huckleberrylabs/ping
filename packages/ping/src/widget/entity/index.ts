import * as iots from "io-ts";
import { UUID, Phone, Color, Url } from "@huckleberrylabs/core";
import * as Icon from "../icon";
import * as Country from "../../country";

export const Name = "ping:widget";

export const Codec = iots.type(
  {
    type: iots.literal(Name),
    id: UUID.Codec,
    phone: Phone.Codec,
    country: Country.Codec,
    homePage: Url.Codec,
    color: Color.Codec,
    icon: Icon.Codec,
    enabled: iots.boolean,
  },
  Name
);

export type T = iots.TypeOf<typeof Codec>;

export const C = (
  phone: Phone.T,
  country: Country.T,
  homePage: Url.T,
  color: Color.T,
  icon: Icon.T
): T => ({
  type: Name,
  id: UUID.C(),
  phone,
  country,
  homePage,
  color,
  icon,
  enabled: true,
});

export const Is = Codec.is;
