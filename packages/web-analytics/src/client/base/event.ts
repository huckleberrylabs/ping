import { none, some } from "fp-ts/lib/Option";
import * as iots from "io-ts";
import { Event, UUID, OptionFromNullable } from "@huckleberryai/core";

export const Name = "web-analytics:client:abstract:event";
export const Codec = iots.intersection(
  [
    iots.type({
      app: OptionFromNullable.Codec(UUID.Codec),
    }),
    Event.Codec,
  ],
  Name
);

export type T = iots.TypeOf<typeof Codec>;

export const C = (app?: UUID.T, corr?: UUID.T, parent?: UUID.T): T => ({
  ...Event.C(corr, parent),
  app: app ? some(app) : none,
});

export const Is = Codec.is;
