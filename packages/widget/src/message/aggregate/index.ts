import {
  PersonName,
  Phone,
  UUID,
  NonEmptyString,
  TimeStamp,
  IEvent,
  IsPersonName,
  IsPhone,
  IsNonEmptyString,
} from "@huckleberryai/core";
import { IsWidgetMessageCreatedEvent } from "../commands/create/event";
import { IsWidgetTextAddedToMessageEvent } from "../commands/add-text/event";
import { IsWidgetNameAddedToMessageEvent } from "../commands/add-name/event";
import { IsWidgetPhoneAddedToMessageEvent } from "../commands/add-phone/event";
import { IsWidgetMessageSentEvent } from "../commands/send/event";

export interface IWidgetMessage {
  id?: UUID;
  created?: TimeStamp;
  text?: NonEmptyString;
  name?: PersonName;
  phone?: Phone;
  sent?: TimeStamp;
}

export const MessageIsReadyToSend = (message: IWidgetMessage) =>
  IsNonEmptyString(message.text) &&
  IsPersonName(message.name) &&
  IsPhone(message.phone);

export const WidgetMessageAggregate = (events: IEvent[]): IWidgetMessage => {
  return events.reduce<IWidgetMessage>((message, curr) => {
    if (IsWidgetMessageCreatedEvent(curr)) {
      message.created = curr.timestamp;
      message.id = curr.id;
    }
    if (IsWidgetTextAddedToMessageEvent(curr)) {
      message.text = curr.message;
      message.id = curr.id;
    }
    if (IsWidgetNameAddedToMessageEvent(curr)) {
      message.name = curr.name;
    }
    if (IsWidgetPhoneAddedToMessageEvent(curr)) {
      message.phone = curr.phone;
    }
    if (IsWidgetMessageSentEvent(curr)) {
      message.sent = curr.timestamp;
    }
    return message;
  }, {});
};
