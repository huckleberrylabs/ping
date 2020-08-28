import * as iots from "io-ts";
import { isSome } from "fp-ts/lib/Option";
import { Either, fold, left, right } from "fp-ts/lib/Either";
import { UUID, NameSpaceCaseString, TimeStamp, Errors } from "../../../values";
import { DecodeErrorFormatter } from "../../../logging";
import * as Message from "../../message";
import * as Contact from "../../contact";

export const Name = "messaging:model:conversation" as NameSpaceCaseString.T;

export const Codec = iots.type(
  {
    type: iots.literal(Name),
    id: UUID.Codec,
    created: TimeStamp.Codec,
    lastActive: TimeStamp.Codec,
    account: UUID.Codec,
    messages: iots.array(UUID.Codec),
    contacts: iots.array(UUID.Codec),
  },
  Name
);
export const Is = Codec.is;
export const Decode = (value: unknown) =>
  fold<iots.Errors, T, Either<Errors.Validation.T, T>>(
    errors =>
      left(
        Errors.Validation.C(Name, `Decode: ${DecodeErrorFormatter(errors)}`)
      ),
    decoded => right(decoded)
  )(Codec.decode(value));
export const Encode = Codec.encode;
export type T = iots.TypeOf<typeof Codec>;
export const C = (account: UUID.T): T => ({
  type: Name,
  id: UUID.C(),
  lastActive: TimeStamp.C(),
  created: TimeStamp.C(),
  account,
  messages: [],
  contacts: [],
});

// Expires in 4 Hours
export const DEFAULT_EXPIRY = 1.44e7;

export const AddMessage = (convo: T) => (
  msg: Message.Model.T
): Either<Errors.Validation.T, T> => {
  if (!SameAccount(convo)(msg))
    return left(
      Errors.Validation.C(
        `${Name}.AddMessage must have same account as conversation`
      )
    );
  if (!BelongsToConversation(convo)(msg))
    return left(
      Errors.Validation.C(Name, "AddMessage: must belong to the conversation")
    );
  if (!ContainsContactID(convo)(msg.from))
    return left(
      Errors.Validation.C(
        Name,
        "AddMessage: conversation must contain message sender id in contact list"
      )
    );
  if (ContainsMessage(convo)(msg))
    return left(
      Errors.Validation.C(
        Name,
        "AddMessage: conversation already contains message"
      )
    );
  convo.messages.push(msg.id);
  if (TimeStamp.Compare(convo.lastActive, msg.timestamp) > 0)
    convo.lastActive = msg.timestamp;
  return right(convo);
};

export const AddContact = (convo: T) => (
  contact: Contact.Model.T
): Either<Errors.Validation.T, T> => {
  if (!SameAccount(convo)(contact))
    return left(
      Errors.Validation.C(
        Name,
        "AddMessage: must have same account as conversation"
      )
    );
  if (!ContainsContact(convo)(contact)) {
    convo.contacts.push(contact.id);
  }
  return right(convo);
};

export const SameAccount = (convo: T) => (
  entity: Message.Model.T | Contact.Model.T
): boolean => convo.account === entity.account;

export const BelongsToConversation = (convo: T) => (
  msg: Message.Model.T
): boolean => isSome(msg.conversation) && convo.id === msg.conversation.value;

export const ContainsContactID = (convo: T) => (id: UUID.T): boolean =>
  convo.contacts.filter(contactID => contactID === id).length > 0;

export const ContainsContact = (convo: T) => (
  contact: Contact.Model.T
): boolean => ContainsContactID(convo)(contact.id);

export const ContainsMessageID = (convo: T) => (id: UUID.T): boolean =>
  convo.messages.filter(msgID => msgID === id).length > 0;

export const ContainsMessage = (convo: T) => (msg: Message.Model.T): boolean =>
  ContainsMessageID(convo)(msg.id);

export const IsExpired = (convo: T) => {
  return TimeStamp.Compare(TimeStamp.C(), convo.lastActive) > DEFAULT_EXPIRY;
};
