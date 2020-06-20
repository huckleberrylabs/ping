import * as iots from "io-ts";
import {
  UUID,
  TimeStamp,
  NonEmptyString,
  NameSpaceCaseString,
  OptionFromNullable,
} from "../../../values";

export const Name = "messaging:model:message" as NameSpaceCaseString.T;

export const Codec = iots.type(
  {
    account: UUID.Codec,
    id: UUID.Codec,
    timestamp: TimeStamp.Codec,
    from: UUID.Codec,
    channel: UUID.Codec,
    conversation: OptionFromNullable.Codec(UUID.Codec),
    content: NonEmptyString.Codec,
    // TODO META string any
  },
  Name
);

export type T = iots.TypeOf<typeof Codec>;

export const Is = Codec.is;
