import { Either } from "fp-ts/lib/Either";
import { Errors, UUID, PersonName, Phone, PhoneWithCountry } from "../values";
import { Message, Conversation, Contact, Router, Channel } from "../messaging";
import { IRepository } from "./repository";

export interface IMessagingService {
  createChannel: (
    account: UUID.T,
    channel: UUID.T,
    kind: "widget" | "sms"
  ) => Promise<Either<Errors.Adapter.T, null>>;
  createContact: (params: {
    account: UUID.T;
    internal: boolean;
    phone: PhoneWithCountry.T;
    name?: PersonName.T;
  }) => Promise<Either<Errors.Adapter.T, UUID.T>>;
  sendMessage: (
    message: Message.Model.T
  ) => Promise<Either<Errors.Adapter.T, null>>;
}

export interface IMessageRepository extends IRepository<Message.Model.T> {
  getByAccount(
    account: UUID.T
  ): Promise<Either<Errors.Adapter.T | Errors.NotFound.T, Message.Model.T[]>>;
}

export interface IConversationRepository
  extends IRepository<Conversation.Model.T> {
  getByAccount(
    account: UUID.T
  ): Promise<
    Either<Errors.Adapter.T | Errors.NotFound.T, Conversation.Model.T[]>
  >;
}

export interface IContactRepository extends IRepository<Contact.Model.T> {
  getByAccount(
    account: UUID.T
  ): Promise<Either<Errors.Adapter.T | Errors.NotFound.T, Contact.Model.T[]>>;
  getByPhone(
    account: UUID.T,
    phone: Phone.T
  ): Promise<Either<Errors.Adapter.T | Errors.NotFound.T, Contact.Model.T>>;
}

export interface IChannelRepository extends IRepository<Channel.Model.T> {
  getByAccount(
    account: UUID.T
  ): Promise<Either<Errors.Adapter.T | Errors.NotFound.T, Channel.Model.T[]>>;
}

export interface IRouterRepository extends IRepository<Router.Model.T> {}
