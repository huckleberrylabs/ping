import { Errors, UUID } from "@huckleberryai/core";
import { Either } from "fp-ts/lib/Either";
import * as Settings from "../settings";
import * as Message from "../message";

export interface SettingsRepository {
  /*  add(
    id: UUID.T,
    settings: Settings.T
  ): Promise<Either<Errors.Adapter.T, null>>; */
  // remove(id: UUID.T): Promise<Either<Errors.Adapter.T, null>>;
  get(
    id: UUID.T
  ): Promise<Either<Errors.Adapter.T | Errors.NotFound.T, Settings.T>>;
}

export interface MessageRepository {
  add(
    id: UUID.T,
    event: Message.Events
  ): Promise<Either<Errors.Adapter.T, null>>;
  remove(id: UUID.T): Promise<Either<Errors.Adapter.T, null>>;
  get(
    id: UUID.T
  ): Promise<Either<Errors.Adapter.T | Errors.NotFound.T, Message.T>>;
}
