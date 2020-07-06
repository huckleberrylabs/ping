import * as iots from "io-ts";
import { UUID, Event, NameSpaceCaseString } from "../../../../values";
import { Message } from "../../../values";

export const Name = "widget:command:receive" as NameSpaceCaseString.T;

export const Codec = iots.intersection(
  [
    iots.type({
      type: iots.literal(Name),
      widget: UUID.Codec,
      message: Message.Codec,
    }),
    Event.Codec,
  ],
  Name
);

export type T = iots.TypeOf<typeof Codec>;

export const C = (widget: UUID.T, message: Message.T): T => ({
  ...Event.C(),
  type: Name,
  widget,
  message,
});

export const Is = Codec.is;
