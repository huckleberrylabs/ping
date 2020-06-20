import * as iots from "io-ts";
import { UUID, Phone, NameSpaceCaseString } from "../../../values";

export const Name = "messaging:model:channel" as NameSpaceCaseString.T;

export const Codec = iots.type(
  {
    account: UUID.Codec,
    id: UUID.Codec,
    phone: Phone.Codec,
  },
  Name
);

export type T = iots.TypeOf<typeof Codec>;

export const Is = Codec.is;
