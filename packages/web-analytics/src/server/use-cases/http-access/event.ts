import * as iots from "io-ts";
import { pipe } from "fp-ts/lib/pipeable";
import { none, some } from "fp-ts/lib/Option";
import { NowRequest } from "@now/node";
import {
  Type,
  UUID,
  Event as Base,
  NonEmptyString,
  optionFromNullable,
} from "@huckleberryai/core";

export const Name = "web-analytics:event:http-access" as Type.T;

export const Codec = iots.intersection([
  Base.Codec,
  iots.type({
    method: optionFromNullable(NonEmptyString.Codec),
    url: optionFromNullable(NonEmptyString.Codec),
    headers: iots.record(
      iots.string,
      iots.union([iots.string, iots.array(iots.string), iots.undefined])
    ),
  }),
]);

export type T = iots.TypeOf<typeof Codec>;

export const C = (req: NowRequest): T =>
  pipe(
    { corr: req.query["corr_id"], parent: req.query["parent_id"] },
    input => ({
      ...Base.C(
        Name,
        UUID.Is(input.corr) ? input.corr : undefined,
        UUID.Is(input.parent) ? input.parent : undefined
      ),
      method: NonEmptyString.Is(req.method) ? some(req.method) : none,
      url: NonEmptyString.Is(req.url) ? some(req.url) : none,
      headers: req.headers,
    })
  );
