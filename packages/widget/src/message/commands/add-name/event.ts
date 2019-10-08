import * as iots from "io-ts";
import { PersonNameCodec, Type, TimeStamp } from "@huckleberryai/core";
import { WidgetEventCodec } from "../../../base/event";
import { WidgetAddNameToMessageCommand } from "./command";

export namespace Widget.Message.AddName {
  export const NameAddedEventType = "widget:command:name-added-to-message" as Type;

  export const NameAddedEventCodec = iots.intersection(
    [
      WidgetEventCodec,
      iots.type({
        name: PersonNameCodec,
      }),
    ],
    NameAddedEventType
  );

  export type NameAddedEvent = iots.TypeOf<typeof NameAddedEventCodec>;

  export const NameAddedEvent = (
    origin: Type,
    command: WidgetAddNameToMessageCommand
  ): NameAddedEvent => ({
    ...command,
    type: NameAddedEventType,
    timestamp: TimeStamp(),
    origin,
  });
}
