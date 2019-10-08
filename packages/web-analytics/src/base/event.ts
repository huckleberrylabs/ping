import { Option } from "fp-ts/lib/Option";
import { pipe } from "fp-ts/lib/pipeable";
import { Either, map } from "fp-ts/lib/Either";
import * as t from "io-ts";
import {
  Event,
  EventCodec,
  UUIDCodec,
  UUID,
  Type,
  optionFromNullable,
} from "@huckleberryai/core";

export const WebAnalyticsClientEventCodec = t.intersection([
  EventCodec,
  t.type({
    app: optionFromNullable(UUIDCodec),
  }),
]);

export type WebAnalyticsClientEvent = t.TypeOf<
  typeof WebAnalyticsClientEventCodec
>;

export const WebAnalyticsClientEvent = (type: Type) => (
  app: Option<UUID>,
  origin: UUID,
  corr?: UUID,
  parent?: UUID,
  agent?: UUID
): Either<Error, WebAnalyticsClientEvent> =>
  pipe(
    Event(type, origin, corr, parent, agent),
    map(event => ({ ...event, app }))
  );
