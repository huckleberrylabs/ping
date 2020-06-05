import * as iots from "io-ts";
import { UUID, OptionFromNullable } from "@huckleberrylabs/core";
import { Event } from "../../base";
import * as FingerPrint from "../../fingerprint";
import * as Command from "./command";

export const Name = "web-analytics:client:unloaded";

export const Codec = iots.intersection(
  [
    iots.type({
      type: iots.literal(Name),
      log: iots.array(UUID.Codec),
      fingerprint: OptionFromNullable.Codec(FingerPrint.Codec),
    }),
    Event.Codec,
  ],
  Name
);

export type T = iots.TypeOf<typeof Codec>;

export const C = (input: Command.T): T => ({
  ...input,
  type: Name,
  log: input.log.map(event => event.id),
});
