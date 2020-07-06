import * as iots from "io-ts";
import { UUID, Event, NameSpaceCaseString } from "../../../../values";

export const Name = "messaging:query:router:get-by-id" as NameSpaceCaseString.T;

export const Codec = iots.intersection(
  [iots.type({ type: iots.literal(Name), router: UUID.Codec }), Event.Codec],
  Name
);

export type T = iots.TypeOf<typeof Codec>;

export const C = (router: UUID.T): T => ({
  ...Event.C(),
  router,
  type: Name,
});

export const Is = Codec.is;
