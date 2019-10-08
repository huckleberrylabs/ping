import * as iots from "io-ts";
import { TimeStamp, PhoneCodec, Type } from "@huckleberryai/core";
import { WidgetEventCodec } from "../../../base/event";
import { WidgetAddPhoneToMessageCommand } from "./command";

export const WidgetPhoneAddedToMessageEventType =
  "widget:event:phone-added-to-message";

export const WidgetPhoneAddedToMessageEventCodec = iots.intersection(
  [
    WidgetEventCodec,
    iots.type({
      name: PhoneCodec,
    }),
  ],
  WidgetPhoneAddedToMessageEventType
);

export type WidgetPhoneAddedToMessageEvent = iots.TypeOf<
  typeof WidgetPhoneAddedToMessageEventCodec
>;

export const WidgetPhoneAddedToMessageEvent = (
  origin: Type,
  command: WidgetAddPhoneToMessageCommand
): WidgetPhoneAddedToMessageEvent => ({
  ...command,
  type: WidgetNameAddedToMessageEventType,
  timestamp: TimeStamp(),
  origin,
});
