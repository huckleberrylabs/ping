import * as iots from "io-ts";
import { UUID, NameSpaceCaseString } from "../../../values";

export const Name = "messaging:model:channel" as NameSpaceCaseString.T;

export const Codec = iots.type(
  {
    id: UUID.Codec,
    account: UUID.Codec,
    router: UUID.Codec,
    kind: iots.union([iots.literal("sms"), iots.literal("widget")]),
  },
  Name
);

export type T = iots.TypeOf<typeof Codec>;

export const Is = Codec.is;
