import { IPersonName, IPhone, IUUID, IMessage } from "@huckleberryai/core";
import {
  IsTextWidgetMessageAddedCommand,
  IsTextWidgetNameAddedCommand,
  IsTextWidgetPhoneAddedCommand,
} from "../../events";

type TextMessage = {
  id?: IUUID;
  message?: IMessage;
  name?: IPersonName;
  phone?: IPhone;
};

export function TextMessageAggregator(events: unknown[]): TextMessage {
  return events.reduce<TextMessage>((message, curr) => {
    if (IsTextWidgetMessageAddedCommand(curr)) {
      message.message = curr.message;
      message.id = curr.id;
    }
    if (IsTextWidgetNameAddedCommand(curr)) {
      message.name = curr.name;
    }
    if (IsTextWidgetPhoneAddedCommand(curr)) {
      message.phone = curr.phone;
    }
    return message;
  }, {});
}
