import { none, some } from "fp-ts/lib/Option";
import * as iots from "io-ts";
import { UUID, Type, TimeStamp, optionFromNullable } from "../values";

export const Codec = iots.type({
  id: UUID.Codec,
  type: Type.Codec,
  timestamp: TimeStamp.Codec,
  corr: UUID.Codec,
  parent: optionFromNullable(UUID.Codec),
});

export type T = iots.TypeOf<typeof Codec>;

export const C = (type: Type.T, corr?: UUID.T, parent?: UUID.T): T => ({
  type,
  timestamp: TimeStamp.C(),
  id: UUID.C(),
  corr: corr ? corr : UUID.C(),
  parent: parent ? some(parent) : none,
});

export const Is = Codec.is;
