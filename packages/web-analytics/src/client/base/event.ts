import { pipe } from "fp-ts/lib/pipeable";
import { none, some } from "fp-ts/lib/Option";
import * as iots from "io-ts";
import {
  Event,
  EventCodec,
  UUIDCodec,
  UUID,
  Type,
  optionFromNullable,
} from "@huckleberryai/core";

export const ClientEventCodec = iots.intersection([
  EventCodec,
  iots.type({
    app: optionFromNullable(UUIDCodec),
  }),
]);

export type ClientEvent = iots.TypeOf<typeof ClientEventCodec>;

export const ClientEvent = (type: Type) => (
  app?: UUID,
  corr?: UUID,
  parent?: UUID
): ClientEvent =>
  pipe(
    Event(type, corr, parent),
    event => ({ ...event, app: app ? some(app) : none })
  );
