import * as iots from "io-ts";
import { NowRequest } from "@now/node";
import {
  Type,
  UUID,
  Event as Base,
  NonEmptyString,
  optionFromNullable,
} from "@huckleberryai/core";
import { none, some } from "fp-ts/lib/Option";

export const Name = "web-analytics:event:http-access" as Type.T;

export const Codec = iots.intersection(
  [
    Base.Codec,
    iots.type({
      method: optionFromNullable(NonEmptyString.Codec),
      url: optionFromNullable(NonEmptyString.Codec),
      headers: iots.record(
        iots.string,
        iots.union([iots.string, iots.array(iots.string), iots.undefined])
      ),
    }),
  ],
  Name
);

export type T = iots.TypeOf<typeof Codec>;

export const C = (req: NowRequest): T => {
  req.headers;
  const corrString = req.query["corr_id"];
  const corr = UUID.Is(corrString) ? corrString : undefined;
  const parentString = req.query["parent_id"];
  let parent = UUID.Is(parentString) ? parentString : undefined;
  const event = Base.C(Name, corr, parent);
  return {
    ...event,
    method: NonEmptyString.Is(req.method) ? some(req.method) : none,
    url: NonEmptyString.Is(req.url) ? some(req.url) : none,
    headers: req.headers,
  };
};
