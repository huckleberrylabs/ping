import { Either } from "fp-ts/lib/Either";
import {
  Errors,
  UUID,
  NonEmptyString,
  PersonName,
  Phone,
} from "@huckleberryai/core";
import * as Account from "../account";
import * as Widget from "../widget";
import * as Message from "../message";

export interface AccountRepository {
  get(
    id: UUID.T
  ): Promise<Either<Errors.Adapter.T | Errors.NotFound.T, Account.T>>;
  add(account: Account.T): Promise<Either<Errors.Adapter.T, null>>;
  update(
    account: Account.T
  ): Promise<Either<Errors.Adapter.T | Errors.NotFound.T, null>>;
}

export interface WidgetRepository {
  get(
    id: UUID.T
  ): Promise<Either<Errors.Adapter.T | Errors.NotFound.T, Widget.T>>;
  add(widget: Widget.T): Promise<Either<Errors.Adapter.T, null>>;
  remove(id: UUID.T): Promise<Either<Errors.Adapter.T, null>>;
  update(
    widget: Widget.T
  ): Promise<Either<Errors.Adapter.T | Errors.NotFound.T, null>>;
}

export interface MessageRepository {
  get(
    id: UUID.T
  ): Promise<Either<Errors.Adapter.T | Errors.NotFound.T, Message.T>>;
  add(event: Message.Events): Promise<Either<Errors.Adapter.T, null>>;
  remove(id: UUID.T): Promise<Either<Errors.Adapter.T, null>>;
}

export interface PublicSDK {
  Message: {
    Create: () => Promise<UUID.T>;
    AddText: (
      message: UUID.T,
      text: NonEmptyString.T
    ) => Promise<Either<Errors.T, null>>;
    AddPhone: (
      message: UUID.T,
      phone: Phone.T
    ) => Promise<Either<Errors.T, null>>;
    AddName: (
      message: UUID.T,
      name: PersonName.T
    ) => Promise<Either<Errors.T, null>>;
    Send: (message: UUID.T) => Promise<Either<Errors.T, null>>;
  };
  Widget: {
    Get: () => Promise<Either<Errors.T, Widget.T>>;
  };
}

export interface PrivateSDK {
  Account: {
    Get: (
      account: UUID.T,
      corr?: UUID.T
    ) => Promise<Either<Errors.T, Account.T>>;
    Register: (
      stripeToken: NonEmptyString.T,
      email: NonEmptyString.T,
      userName: PersonName.T,
      billingEmail?: NonEmptyString.T,
      name?: NonEmptyString.T,
      corr?: UUID.T
    ) => Promise<Either<Errors.T, UUID.T>>;
    Update: (
      account: UUID.T,
      email: NonEmptyString.T,
      userName: PersonName.T,
      billingEmail?: NonEmptyString.T,
      name?: NonEmptyString.T,
      corr?: UUID.T
    ) => Promise<Either<Errors.T, null>>;
  };
  Widget: {
    Add: (
      account: UUID.T,
      widget: Widget.T,
      corr?: UUID.T
    ) => Promise<Either<Errors.T, UUID.T>>;
    Update: (
      account: UUID.T,
      widget: Widget.T,
      corr?: UUID.T
    ) => Promise<Either<Errors.T, null>>;
  };
}
