import * as iots from "io-ts";
import { pipe } from "fp-ts/lib/pipeable";
import { some, none } from "fp-ts/lib/Option";
import { Type, optionFromNullable, UUID, UUIDCodec } from "@huckleberryai/core";
import { ClientEvent, ClientEventCodec } from "../../base";
import { Log, LogCodec, FingerPrint, FingerPrintCodec } from "../../domain";

export const EventType = "web-analytics:event:client-unloaded" as Type;

export const EventCodec = iots.intersection([
  ClientEventCodec,
  iots.type({
    log: LogCodec,
    fingerprint: optionFromNullable(FingerPrintCodec),
  }),
]);

export type Event = iots.TypeOf<typeof EventCodec>;

export const NormalizedEventCodec = iots.intersection([
  ClientEventCodec,
  iots.type({
    log: iots.array(UUIDCodec),
    fingerprint: optionFromNullable(FingerPrintCodec),
  }),
]);

export type NormalizedEvent = iots.TypeOf<typeof NormalizedEventCodec>;

export const Event = (
  log: Log,
  fingerprint?: FingerPrint,
  app?: UUID,
  corr?: UUID,
  parent?: UUID
): Event =>
  pipe(
    ClientEvent(EventType)(app, corr, parent),
    event => ({
      ...event,
      log,
      fingerprint: fingerprint ? some(fingerprint) : none,
    })
  );

export const NormalizeEvent = (input: Event): NormalizedEvent => ({
  ...input,
  log: input.log.map(event => event.id),
});
