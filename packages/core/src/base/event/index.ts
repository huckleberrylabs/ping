import { pipe } from "fp-ts/lib/pipeable";
import { none, some } from "fp-ts/lib/Option";
import { Either, map } from "fp-ts/lib/Either";
import * as iots from "io-ts";
import { GetContext } from "../../singletons";
import {
  UUID,
  UUIDCodec,
  TimeStamp,
  TimeStampCodec,
  Type,
  TypeCodec,
  optionFromNullable,
} from "../../values";

export const EventCodec = iots.type({
  timestamp: TimeStampCodec,
  type: TypeCodec,
  context: TypeCodec,
  origin: TypeCodec,
  id: UUIDCodec,
  corr: UUIDCodec,
  parent: optionFromNullable(UUIDCodec),
  agent: optionFromNullable(UUIDCodec),
});

export type Event = iots.TypeOf<typeof EventCodec>;

export const Event = (
  type: Type,
  origin: Type,
  corr?: UUID,
  parent?: UUID,
  agent?: UUID
): Either<Error, Event> =>
  pipe(
    GetContext(),
    map(context => ({
      type,
      timestamp: TimeStamp(),
      context,
      origin,
      id: UUID(),
      corr: corr ? corr : UUID(),
      parent: parent ? some(parent) : none,
      agent: agent ? some(agent) : none,
    }))
  );
