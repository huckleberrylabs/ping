import { IPersonName, IPhone } from "@huckleberryai/core";
import {
  IsTextWidgetMessageAddedCommand,
  IsTextWidgetNameAddedCommand,
  IsTextWidgetPhoneAddedCommand,
} from "../../events";

type TextMessage = { message?: string; name?: IPersonName; phone?: IPhone };

export function TextMessageAggregator(events: unknown[]): TextMessage {
  return events.reduce<TextMessage>((textMessage, curr) => {
    if (IsTextWidgetMessageAddedCommand(curr)) {
      textMessage.message = curr.message;
    }
    if (IsTextWidgetNameAddedCommand(curr)) {
      textMessage.name = curr.name;
    }
    if (IsTextWidgetPhoneAddedCommand(curr)) {
      textMessage.phone = curr.phone;
    }
    return textMessage;
  }, {});
}
