import { IPersonName } from "@huckleberryai/core/src/value-objects/person-name";
import { IPhone } from "@huckleberryai/core/src/value-objects/phone";
import { IUUID } from "@huckleberryai/core/src/value-objects/uuid";
import { IMessage } from "@huckleberryai/core/src/value-objects/message";
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
