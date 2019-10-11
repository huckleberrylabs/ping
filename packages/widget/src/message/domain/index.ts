import {
  UUID,
  Phone,
  TimeStamp,
  PersonName,
  NonEmptyString,
  PhoneCodec,
  PersonNameCodec,
  NonEmptyStringCodec,
} from "@huckleberryai/core";
import {
  Event as Create,
  EventCodec as CreateCodec,
} from "../use-cases/create/event";
import {
  Event as TextAdded,
  EventCodec as TextAddedCodec,
} from "../use-cases/add-text/event";
import {
  Event as NameAdded,
  EventCodec as NameAddedCodec,
} from "../use-cases/add-name/event";
import {
  Event as PhoneAdded,
  EventCodec as PhoneAddedCodec,
} from "../use-cases/add-phone/event";
import {
  Event as Sent,
  EventCodec as SentCodec,
} from "../use-cases/send/event";
import { pipe } from "fp-ts/lib/pipeable";
import { left, right } from "fp-ts/lib/Either";

export interface Message {
  id: UUID;
  created: TimeStamp;
  text?: NonEmptyString;
  name?: PersonName;
  phone?: Phone;
  sent?: TimeStamp;
}

export const MessageIsReadyToSend = (message: Message) =>
  NonEmptyStringCodec.is(message.text) &&
  PersonNameCodec.is(message.name) &&
  PhoneCodec.is(message.phone);

export const WidgetMessageAggregate = (
  events: (Create | TextAdded | NameAdded | PhoneAdded | Sent)[]
) =>
  pipe(
    {
      id: events.filter(CreateCodec.is)[0].message,
      created: events.filter(CreateCodec.is)[0].timestamp,
      text: events.filter(TextAddedCodec.is)[0].text,
      name: events.filter(NameAddedCodec.is)[0].name,
      phone: events.filter(PhoneAddedCodec.is)[0].phone,
      sent: events.filter(SentCodec.is)[0].timestamp,
    },
    message =>
      message.id ? right(message) : left(new Error("message does not exist"))
  );
