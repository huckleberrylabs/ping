import * as iots from "io-ts";
import * as Event from "../event";
import { UUID } from "../values";
import { toUndefined } from "fp-ts/lib/Option";

export const Name = "core:abstract:result";
export const Codec = iots.intersection(
  [
    iots.type({
      req: UUID.Codec,
    }),
    Event.Codec,
  ],
  Name
);
export type T = iots.TypeOf<typeof Codec>;
export const C = (event: Event.T): T => ({
  ...Event.C(event.corr, toUndefined(event.parent)),
  req: event.id,
});
export const Is = Codec.is;
