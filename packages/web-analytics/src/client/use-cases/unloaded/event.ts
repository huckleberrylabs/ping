import * as iots from "io-ts";
import { pipe } from "fp-ts/lib/pipeable";
import { some, none } from "fp-ts/lib/Option";
import { Type, UUID, optionFromNullable } from "@huckleberryai/core";
import * as Base from "../../base";
import * as FingerPrint from "../../fingerprint";
import * as Logging from "../../logging";

export const Name = "web-analytics:event:client-unloaded" as Type.T;

export const Codec = iots.intersection([
  Base.Event.Codec,
  iots.type({
    log: Logging.Log.Codec,
    fingerprint: optionFromNullable(FingerPrint.Codec),
  }),
]);

export type T = iots.TypeOf<typeof Codec>;

export const C = (
  log: Logging.Log.T,
  fingerprint?: FingerPrint.T,
  app?: UUID.T,
  corr?: UUID.T,
  parent?: UUID.T
): T =>
  pipe(
    Base.Event.C(Name)(app, corr, parent),
    event => ({
      ...event,
      log,
      fingerprint: fingerprint ? some(fingerprint) : none,
    })
  );

export const NormalizedCodec = iots.intersection([
  Base.Event.Codec,
  iots.type({
    log: iots.array(UUID.Codec),
    fingerprint: optionFromNullable(FingerPrint.Codec),
  }),
]);

export type Normalized = iots.TypeOf<typeof NormalizedCodec>;

export const Normalize = (input: T): Normalized => ({
  ...input,
  log: input.log.map(event => event.id),
});
