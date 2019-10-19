import { Errors, UUID, Phone, PersonName } from "@huckleberryai/core";
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

export interface SDK {
  Message: {
    Create: () => Promise<Either<Errors.T, UUID.T>>;
    AddText: (message: UUID.T, text: string) => Promise<Either<Errors.T, null>>;
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
  Settings: {
    Get: () => Promise<Either<Errors.T, Settings.T>>;
  };
}
