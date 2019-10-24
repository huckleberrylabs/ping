import * as iots from "io-ts";
import { UUID, Phone, Color, Url } from "@huckleberryai/core";

export const Name = "ping:widget";

export const Codec = iots.type(
  {
    type: iots.literal(Name),
    id: UUID.Codec,
    phone: Phone.Codec,
    homePage: Url.Codec,
    color: Color.Codec,
    enabled: iots.boolean,
  },
  Name
);

export type T = iots.TypeOf<typeof Codec>;

export const C = (phone: Phone.T, homePage: Url.T, color: Color.T): T => ({
  type: Name,
  id: UUID.C(),
  phone,
  homePage,
  color,
  enabled: true,
});

export const Is = Codec.is;
