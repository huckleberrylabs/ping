import * as iots from "io-ts";
import { UUID, NameSpaceCaseString, TimeStamp, Errors } from "../../../values";
import * as Message from "../../message";
import * as Contact from "../../contact";
import { Either, left, right } from "fp-ts/lib/Either";
import { isSome } from "fp-ts/lib/Option";

export const Name = "messaging:model:conversation" as NameSpaceCaseString.T;

export const Codec = iots.type(
  {
    id: UUID.Codec,
    createdAt: TimeStamp.Codec,
    latestMessageAt: TimeStamp.Codec,
    account: UUID.Codec,
    messages: iots.array(UUID.Codec),
    contacts: iots.array(UUID.Codec),
  },
  Name
);

export type T = iots.TypeOf<typeof Codec>;

export const C = (account: UUID.T) => ({
  id: UUID.C(),
  // TODO this is semantically incorrect
  latestMessageAt: TimeStamp.C(),
  createdAt: TimeStamp.C(),
  account,
  messages: [],
  contacts: [],
});

export const Is = Codec.is;

// Expires in 4 Hours
export const DEFAULT_EXPIRY = 1.44e7;

export const AddMessage = (convo: T) => (
  msg: Message.Model.T
): Either<Errors.Validation.T, T> => {
  if (!SameAccount(convo)(msg)) return left(Errors.Validation.C());
  if (!BelongsToConversation(convo)(msg)) return left(Errors.Validation.C());
  if (!ContainsContactID(convo)(msg.from)) return left(Errors.Validation.C());
  if (ContainsMessage(convo)(msg)) return left(Errors.Validation.C());
  convo.messages.push(msg.id);
  if (TimeStamp.Compare(convo.latestMessageAt, msg.timestamp) > 0)
    convo.latestMessageAt = msg.timestamp;
  return right(convo);
};

export const AddContact = (convo: T) => (
  contact: Contact.Model.T
): Either<Errors.Validation.T, T> => {
  if (!SameAccount(convo)(contact)) return left(Errors.Validation.C());
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

// TODO check this is correct
export const IsExpired = (convo: T) =>
  TimeStamp.Compare(convo.latestMessageAt, TimeStamp.C()) > DEFAULT_EXPIRY;
