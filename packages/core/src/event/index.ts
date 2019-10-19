import { none, some } from "fp-ts/lib/Option";
import * as iots from "io-ts";
import { UUID, Type, TimeStamp, OptionFromNullable } from "../values";

export const Name = "core:abstract:event";
export const Codec = iots.type(
  {
    id: UUID.Codec,
    timestamp: TimeStamp.Codec,
    corr: UUID.Codec,
    parent: OptionFromNullable.Codec(UUID.Codec),
  },
  Name
);

export type CodecType = iots.TypeOf<typeof Codec>;

export type T = {
  type: Type.T;
} & CodecType;

export const C = (corr?: UUID.T, parent?: UUID.T): CodecType => ({
  timestamp: TimeStamp.C(),
  id: UUID.C(),
  corr: corr ? corr : UUID.C(),
  parent: parent ? some(parent) : none,
});

export const Is = Codec.is;
