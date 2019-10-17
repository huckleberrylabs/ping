import { Errors, UUID } from "@huckleberryai/core";
import { TaskEither } from "fp-ts/lib/TaskEither";
import * as Settings from "./settings";
import * as Message from "./message";

export type Event =
  | Message.UseCases.Create.Event.T
  | Message.UseCases.AddText.Event.T
  | Message.UseCases.AddName.Event.T
  | Message.UseCases.AddPhone.Event.T
  | Message.UseCases.Send.Event.T;

export interface SettingsRepository {
  add(id: UUID.T, settings: Settings.T): TaskEither<Errors.Adapter, true>;
  delete(id: UUID.T): TaskEither<Errors.Adapter, true>;
  get(id: UUID.T): TaskEither<Errors.Adapter | Errors.NotFound, Settings.T>;
}

export interface MessageRepository {
  add(id: UUID.T, event: Event): TaskEither<Errors.Adapter, true>;
  delete(id: UUID.T): TaskEither<Errors.Adapter, true>;
  get(id: UUID.T): TaskEither<Errors.Adapter | Errors.NotFound, Message.T>;
}
