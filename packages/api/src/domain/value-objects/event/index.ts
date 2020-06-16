import * as iots from "io-ts";
import {
  UUID,
  TimeStamp,
  NameSpaceCaseString,
  Json,
} from "@huckleberrylabs/core";

export const Name = "event";
export const Codec = iots.type(
  {
    id: UUID.Codec,
    timestamp: TimeStamp.Codec,
  },
  Name
);

export type CodecType = iots.TypeOf<typeof Codec>;

export type T = {
  type: NameSpaceCaseString.T;
  [key: string]: any;
} & CodecType;

export type SerializedT = Json.JObject & {
  type: string;
};

export const C = (): CodecType => ({
  timestamp: TimeStamp.C(),
  id: UUID.C(),
});

export const Is = Codec.is;
