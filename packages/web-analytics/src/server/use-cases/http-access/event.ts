import * as iots from "io-ts";
import { none, some } from "fp-ts/lib/Option";
import {
  UUID,
  Event,
  NonEmptyString,
  OptionFromNullable,
} from "@huckleberryai/core";

export const Name = "web-analytics:server:http-access";

export const Codec = iots.intersection(
  [
    iots.type({
      type: iots.literal(Name),
      method: OptionFromNullable.Codec(NonEmptyString.Codec),
      url: OptionFromNullable.Codec(NonEmptyString.Codec),
      headers: iots.record(
        iots.string,
        iots.union([iots.string, iots.array(iots.string), iots.undefined])
      ),
    }),
    Event.Codec,
  ],
  Name
);

export type T = iots.TypeOf<typeof Codec>;

export const C = (req: any): T => {
  const corrParam = req.query["corr_id"];
  const parentParam = req.query["parent_id"];
  return {
    ...Event.C(
      UUID.Is(corrParam) ? corrParam : undefined,
      UUID.Is(parentParam) ? parentParam : undefined
    ),
    type: Name,
    method: NonEmptyString.Is(req.method) ? some(req.method) : none,
    url: NonEmptyString.Is(req.url) ? some(req.url) : none,
    headers: req.headers,
  };
};
