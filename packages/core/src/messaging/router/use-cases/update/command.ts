import * as iots from "io-ts";
import { Event, NameSpaceCaseString } from "../../../../values";
import * as Model from "../../model";

export const Name = "messaging:command:router:update" as NameSpaceCaseString.T;

export const Codec = iots.intersection(
  [
    iots.type({
      type: iots.literal(Name),
      router: Model.Codec,
    }),
    Event.Codec,
  ],
  Name
);

export type T = iots.TypeOf<typeof Codec>;

export const C = (router: Model.T): T => ({
  ...Event.C(),
  type: Name,
  router,
});

export const Is = Codec.is;
