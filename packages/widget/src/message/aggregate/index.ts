import {
  PersonName,
  Phone,
  UUID,
  NonEmptyString,
  TimeStamp,
} from "@huckleberryai/core";
import { IsCreateWidgetMessageCommand } from "../commands/create/command";
import { IsAddTextToWidgetMessageCommand } from "../commands/add-text/command";
import { IsAddNameToWidgetMessageCommand } from "../commands/add-name/command";
import { IsAddPhoneToWidgetMessageCommand } from "../commands/add-phone/command";
import { IsSendWidgetMessageCommand } from "../commands/send/command";

export interface IWidgetMessage {
  id?: UUID;
  created?: TimeStamp;
  text?: NonEmptyString;
  name?: PersonName;
  phone?: Phone;
  sent?: TimeStamp;
}

export function WidgetMessageAggregate(events: unknown[]): IWidgetMessage {
  return events.reduce<IWidgetMessage>((message, curr) => {
    if (IsCreateWidgetMessageCommand(curr)) {
      message.created = curr.timestamp;
      message.id = curr.id;
    }
    if (IsAddTextToWidgetMessageCommand(curr)) {
      message.text = curr.message;
      message.id = curr.id;
    }
    if (IsAddNameToWidgetMessageCommand(curr)) {
      message.name = curr.name;
    }
    if (IsAddPhoneToWidgetMessageCommand(curr)) {
      message.phone = curr.phone;
    }
    if (IsSendWidgetMessageCommand(curr)) {
      message.sent = curr.timestamp;
    }
    return message;
  }, {});
}
