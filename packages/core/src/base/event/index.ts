import { none, some } from "fp-ts/lib/Option";
import * as iots from "io-ts";
import {
  UUID,
  UUIDCodec,
  Type,
  TypeCodec,
  TimeStamp,
  TimeStampCodec,
  optionFromNullable,
} from "../../values";

export const EventCodec = iots.type({
  id: UUIDCodec,
  type: TypeCodec,
  timestamp: TimeStampCodec,
  corr: UUIDCodec,
  parent: optionFromNullable(UUIDCodec),
});

export type Event = iots.TypeOf<typeof EventCodec>;

export const Event = (type: Type, corr?: UUID, parent?: UUID): Event => ({
  type,
  timestamp: TimeStamp(),
  id: UUID(),
  corr: corr ? corr : UUID(),
  parent: parent ? some(parent) : none,
});
