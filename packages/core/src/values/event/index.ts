import * as iots from "io-ts";
import * as UUID from "../uuid";
import * as NameSpaceCaseString from "../namespace-case-string";
import * as TimeStamp from "../timestamp";
import * as Json from "../json";

export const Name = "value:event" as NameSpaceCaseString.T;

export const Codec = iots.type(
  {
    id: UUID.Codec,
    timestamp: TimeStamp.Codec,
  },
  Name
);
export const Is = Codec.is;
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
