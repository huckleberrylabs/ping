import * as iots from "io-ts";
import { UUID, Type, Phone, Color } from "@huckleberryai/core";

const DEFAULT_COLOR = "#1e73be";

export const Name = "widget:settings" as Type.T;

export const Codec = iots.type(
  {
    type: Type.Codec,
    id: UUID.Codec,
    phone: Phone.Codec,
    color: Color.Codec,
    enabled: iots.boolean,
  },
  Name
);

export type T = iots.TypeOf<typeof Codec>;

export const C = (phone: Phone.T): T => ({
  type: Name,
  id: UUID.C(),
  phone: phone,
  color: DEFAULT_COLOR as Color.T,
  enabled: true,
});
