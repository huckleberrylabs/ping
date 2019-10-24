import { Either } from "fp-ts/lib/Either";
import { Errors, UUID } from "@huckleberryai/core";
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
}

export interface MessageRepository {
  get(
    id: UUID.T
  ): Promise<Either<Errors.Adapter.T | Errors.NotFound.T, Message.T>>;
  add(event: Message.Events): Promise<Either<Errors.Adapter.T, null>>;
  remove(id: UUID.T): Promise<Either<Errors.Adapter.T, null>>;
}
