import { Either } from "fp-ts/lib/Either";
import { Errors, UUID, PersonName, Phone } from "../values";
import { Message, Conversation, Contact, Router, Channel } from "../messaging";

export interface IMessagingService {
  createChannel: (
    account: UUID.T,
    router: UUID.T,
    channel: UUID.T
  ) => Promise<Either<Errors.Adapter.T, null>>;
  createContact: (params: {
    account: UUID.T;
    phone: Phone.T;
    name?: PersonName.T;
  }) => Promise<Either<Errors.Adapter.T, UUID.T>>;
  sendMessage: (
    message: Message.Model.T
  ) => Promise<Either<Errors.Adapter.T, null>>;
}

export interface IMessageRepository {
  get(
    id: UUID.T
  ): Promise<Either<Errors.Adapter.T | Errors.NotFound.T, Message.Model.T>>;
  add(message: Message.Model.T): Promise<Either<Errors.Adapter.T, null>>;
  remove(id: UUID.T): Promise<Either<Errors.Adapter.T, null>>;
  update(
    message: Message.Model.T
  ): Promise<Either<Errors.Adapter.T | Errors.NotFound.T, null>>;
  exists(
    id: UUID.T
  ): Promise<
    Either<Errors.Adapter.T | Errors.NotImplemented.T | Errors.NotFound.T, null>
  >;
}

export interface IConversationRepository {
  get(
    id: UUID.T
  ): Promise<
    Either<Errors.Adapter.T | Errors.NotFound.T, Conversation.Model.T>
  >;
  add(convo: Conversation.Model.T): Promise<Either<Errors.Adapter.T, null>>;
  remove(id: UUID.T): Promise<Either<Errors.Adapter.T, null>>;
  update(
    convo: Conversation.Model.T
  ): Promise<Either<Errors.Adapter.T | Errors.NotFound.T, null>>;
  exists(
    id: UUID.T
  ): Promise<
    Either<Errors.Adapter.T | Errors.NotImplemented.T | Errors.NotFound.T, null>
  >;
}

export interface IContactRepository {
  get(
    id: UUID.T
  ): Promise<Either<Errors.Adapter.T | Errors.NotFound.T, Contact.Model.T>>;
  getByPhone(
    phone: Phone.T
  ): Promise<Either<Errors.Adapter.T | Errors.NotFound.T, Contact.Model.T>>;
  add(contact: Contact.Model.T): Promise<Either<Errors.Adapter.T, null>>;
  remove(id: UUID.T): Promise<Either<Errors.Adapter.T, null>>;
  update(
    contact: Contact.Model.T
  ): Promise<Either<Errors.Adapter.T | Errors.NotFound.T, null>>;
  exists(
    id: UUID.T
  ): Promise<
    Either<Errors.Adapter.T | Errors.NotImplemented.T | Errors.NotFound.T, null>
  >;
}

export interface IChannelRepository {
  get(
    id: UUID.T
  ): Promise<Either<Errors.Adapter.T | Errors.NotFound.T, Channel.Model.T>>;
  add(channel: Channel.Model.T): Promise<Either<Errors.Adapter.T, null>>;
  remove(id: UUID.T): Promise<Either<Errors.Adapter.T, null>>;
  update(
    channel: Channel.Model.T
  ): Promise<Either<Errors.Adapter.T | Errors.NotFound.T, null>>;
  exists(
    id: UUID.T
  ): Promise<
    Either<Errors.Adapter.T | Errors.NotImplemented.T | Errors.NotFound.T, null>
  >;
}

export interface IRouterRepository {
  get(
    id: UUID.T
  ): Promise<Either<Errors.Adapter.T | Errors.NotFound.T, Router.Model.T>>;
  add(router: Router.Model.T): Promise<Either<Errors.Adapter.T, null>>;
  remove(id: UUID.T): Promise<Either<Errors.Adapter.T, null>>;
  update(
    router: Router.Model.T
  ): Promise<Either<Errors.Adapter.T | Errors.NotFound.T, null>>;
  exists(
    id: UUID.T
  ): Promise<
    Either<Errors.Adapter.T | Errors.NotImplemented.T | Errors.NotFound.T, null>
  >;
}
