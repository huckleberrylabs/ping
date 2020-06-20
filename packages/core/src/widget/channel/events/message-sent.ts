import * as iots from "io-ts";
import { Message } from "../../values";
import { Event, NameSpaceCaseString, UUID } from "../../../values";
import { Command } from "../use-cases/send-message";

export const Name = "widget:event:message-sent" as NameSpaceCaseString.T;

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

export const C = (command: Command.T): T => ({
  ...command,
  type: Name,
});

export const Is = Codec.is;
