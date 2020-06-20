import * as iots from "io-ts";
import * as Event from "../../event";
import * as NameSpaceCaseString from "../../namespace-case-string";

export const Name = "error:environment" as NameSpaceCaseString.T;

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
