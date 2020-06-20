import * as iots from "io-ts";
import { UUID, Event, NameSpaceCaseString } from "../../../../values";
import * as Model from "../../model";

export const Name = "widget:command:create" as NameSpaceCaseString.T;

export const Codec = iots.intersection(
  [
    iots.type({
      type: iots.literal(Name),
      account: UUID.Codec,
      router: UUID.Codec,
      widget: Model.Codec,
    }),
    Event.Codec,
  ],
  Name
);

export type T = iots.TypeOf<typeof Codec>;

export const C = (account: UUID.T, router: UUID.T, widget: Model.T): T => ({
  ...Event.C(),
  type: Name,
  account,
  router,
  widget,
});

export const Is = Codec.is;
