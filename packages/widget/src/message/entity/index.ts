import * as iots from "io-ts";
import {
  Phone,
  PersonName,
  NonEmptyString,
  UUID,
  TimeStamp,
  optionFromNullable,
} from "@huckleberryai/core";
import * as Create from "../use-cases/create/event";
import * as TextAdded from "../use-cases/add-text/event";
import * as NameAdded from "../use-cases/add-name/event";
import * as PhoneAdded from "../use-cases/add-phone/event";
import * as Sent from "../use-cases/send/event";
import { pipe } from "fp-ts/lib/pipeable";
import { left, right } from "fp-ts/lib/Either";
import { isSome, isNone } from "fp-ts/lib/Option";

export const Codec = iots.type({
  id: UUID.Codec,
  created: TimeStamp.Codec,
  text: optionFromNullable(NonEmptyString.Codec),
  name: optionFromNullable(PersonName.Codec),
  phone: optionFromNullable(Phone.Codec),
  sent: optionFromNullable(TimeStamp.Codec),
});

export type T = iots.TypeOf<typeof Codec>;

export const CanSend = (message: T) =>
  isSome(message.text) &&
  isSome(message.name) &&
  isSome(message.phone) &&
  isNone(message.sent);

export const Aggregate = (
  events: (Create.T | TextAdded.T | NameAdded.T | PhoneAdded.T | Sent.T)[]
) =>
  pipe(
    {
      id: events.filter(Create.Is)[0].message,
      created: events.filter(Create.Is)[0].timestamp,
      text: events.filter(TextAdded.Is)[0].text,
      name: events.filter(NameAdded.Is)[0].name,
      phone: events.filter(PhoneAdded.Is)[0].phone,
      sent: events.filter(Sent.Is)[0].timestamp,
    },
    message =>
      message.id ? right(message) : left(new Error("message does not exist"))
  );
