import * as iots from "io-ts";
import * as Event from "../../event";

export const Name = "core:error:forbidden";
export const Codec = iots.intersection(
  [iots.type({ type: iots.literal(Name) }), Event.Codec],
  Name
);
export type T = iots.TypeOf<typeof Codec>;
export const C = (): T => ({
  ...Event.C(),
  type: Name,
});
export const Is = Codec.is;
