import * as iots from "io-ts";
import * as Event from "../../event";
import * as Result from "../../result";
import { StatusCode } from "../../values";

export const Name = "core:result:internal-error";

export const Codec = iots.intersection(
  [
    iots.type({
      type: iots.literal(Name),
      status: iots.literal(StatusCode.INTERNAL_SERVER_ERROR),
    }),
    Result.Codec,
  ],
  Name
);

export type T = iots.TypeOf<typeof Codec>;

export const C = (event: Event.T): T => ({
  ...Result.C(event),
  type: Name,
  status: StatusCode.INTERNAL_SERVER_ERROR,
});

export const Is = Codec.is;
