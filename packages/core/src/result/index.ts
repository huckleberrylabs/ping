import * as iots from "io-ts";
import * as Base from "../event";
import { StatusCode, UUID, Type } from "../values";
import { isSome } from "fp-ts/lib/Option";

export const Codec = iots.intersection([
  Base.Codec,
  iots.type({
    status: StatusCode.Codec,
    req: UUID.Codec,
  }),
]);

export type T = iots.TypeOf<typeof Codec>;

export const C = (type: Type.T) => (status: StatusCode.T) => (
  event: Base.T
) => ({
  ...Base.C(
    type,
    event.corr,
    isSome(event.parent) ? event.parent.value : undefined
  ),
  status,
  req: event.id,
});
