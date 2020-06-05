import * as iots from "io-ts";
import { Event } from "../../base";
import { UUID } from "@huckleberrylabs/core";

export const Name = "web-analytics:client:loaded";

export const Codec = iots.intersection(
  [
    iots.type({
      type: iots.literal(Name),
    }),
    Event.Codec,
  ],
  Name
);

export type T = iots.TypeOf<typeof Codec>;
export const C = (app?: UUID.T, corr?: UUID.T, parent?: UUID.T): T => ({
  ...Event.C(app, corr, parent),
  type: Name,
});
