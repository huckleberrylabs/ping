import { UUID } from "@huckleberryai/core";
import { Either } from "fp-ts/lib/Either";
import * as Settings from "./settings";
import * as Message from "./message";
import { Option } from "fp-ts/lib/Option";

export type Event =
  | Message.UseCases.Create.Event.T
  | Message.UseCases.AddText.Event.T
  | Message.UseCases.AddName.Event.T
  | Message.UseCases.AddPhone.Event.T
  | Message.UseCases.Send.Event.T;

export interface SettingsRepository {
  add(settings: Settings.T): Promise<void>;
  get(id: UUID.T): Promise<Either<Error, Option<Settings.T>>>;
}

export interface MessageRepository {
  add(event: Event): Promise<void>;
  get(id: UUID.T): Promise<Either<Error, Option<Message.T>>>;
}
