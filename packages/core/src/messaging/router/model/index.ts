import * as iots from "io-ts";
import { UUID, NameSpaceCaseString } from "../../../values";

export const Name = "messaging:model:router" as NameSpaceCaseString.T;

export const Codec = iots.type(
  {
    id: UUID.Codec,
    account: UUID.Codec,
    contact: UUID.Codec,
  },
  Name
);

export type T = iots.TypeOf<typeof Codec>;

export const Is = Codec.is;
