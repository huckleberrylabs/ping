import * as iots from "io-ts";
import { UUID, Phone, NameSpaceCaseString, TimeStamp } from "../../../values";

export const Name = "sms:model:number-pairing" as NameSpaceCaseString.T;

export const Codec = iots.type(
  {
    created: TimeStamp.Codec,
    account: UUID.Codec,
    conversation: UUID.Codec,
    to: Phone.Codec,
    from: Phone.Codec,
  },
  Name
);

export type T = iots.TypeOf<typeof Codec>;

export const C = (
  account: UUID.T,
  conversation: UUID.T,
  to: Phone.T,
  from: Phone.T
): T => ({
  created: TimeStamp.C(),
  account,
  conversation,
  to,
  from,
});

export const Is = Codec.is;
