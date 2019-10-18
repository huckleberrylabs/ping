import * as Created from "../use-cases/create/event";
import * as TextAdded from "../use-cases/add-text/event";
import * as NameAdded from "../use-cases/add-name/event";
import * as PhoneAdded from "../use-cases/add-phone/event";
import * as Sent from "../use-cases/send/event";

export type Event =
  | Created.T
  | TextAdded.T
  | NameAdded.T
  | PhoneAdded.T
  | Sent.T;
export type T = Event[];

export const Text = (message: T) => message.filter(TextAdded.Is)[0].text;
export const Name = (message: T) => message.filter(NameAdded.Is)[0].name;
export const Phone = (message: T) => message.filter(PhoneAdded.Is)[0].phone;

export const IsValid = (message: T) =>
  HasOneID(message) &&
  WasCreatedOnce(message) &&
  WasSentOnceOrNever(message) &&
  WasSentAfterCreated(message);

export const HasOneID = (message: T) =>
  new Set(message.map(event => event.message)).size === 1;

export const WasCreatedOnce = (message: T) =>
  message.filter(Created.Is).length === 1;

export const WasSent = (message: T) => message.filter(Sent.Is).length === 1;

export const WasSentOnceOrNever = (message: T) =>
  message.filter(Sent.Is).length === 0 || WasSent(message);

export const WasSentAfterCreated = (message: T) =>
  WasSent(message)
    ? message.filter(Sent.Is)[0].timestamp >
      message.filter(Created.Is)[0].timestamp
    : true;

export const CanSend = (message: T) =>
  message.filter(TextAdded.Is).length === 1 &&
  message.filter(NameAdded.Is).length === 1 &&
  message.filter(PhoneAdded.Is).length === 1 &&
  message.filter(Sent.Is).length === 0;

/* export const Codec = iots.type({
  id: UUID.Codec,
  created: TimeStamp.Codec,
  text: OptionFromNullable.Codec(NonEmptyString.Codec),
  name: OptionFromNullable.Codec(PersonName.Codec),
  phone: OptionFromNullable.Codec(Phone.Codec),
  sent: OptionFromNullable.Codec(TimeStamp.Codec),
}); */

/* export type T = iots.TypeOf<typeof Codec>; */
