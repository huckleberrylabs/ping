import * as iots from "io-ts";
import * as Event from "../../event";
import * as Result from "../../result";
import { StatusCode } from "../../values";

export const Name = "core:result:ok";

export const Codec = iots.intersection(
  [
    iots.type({
      type: iots.literal(Name),
      status: iots.literal(StatusCode.OK),
    }),
    Result.Codec,
  ],
  Name
);

export type T = iots.TypeOf<typeof Codec>;

export const C = (event: Event.T): T => ({
  ...Result.C(event),
  type: Name,
  status: StatusCode.OK,
});

export const Is = Codec.is;
