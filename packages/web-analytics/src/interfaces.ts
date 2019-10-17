import { TaskEither } from "fp-ts/lib/TaskEither";
import { UUID, Errors } from "@huckleberryai/core";
import { Logging, UseCases } from "./client";
import * as Server from "./server";

export type Event =
  | Logging.Event.T
  | UseCases.Loaded.Event.T
  | UseCases.Unloaded.Event.T
  | Server.UseCases.HTTPAccess.Event.T;

export type Logger = (
  level: Logging.Level.T,
  message: string,
  tags: string[],
  parent?: UUID.T
) => void;

export interface Repository {
  save(id: UUID.T, event: Event): TaskEither<Errors.Adapter, true>;
  delete(id: UUID.T): TaskEither<Errors.Adapter, true>;
  get(id: UUID.T): TaskEither<Errors.Adapter | Errors.NotFound, Event>;
  getByCorrID(corr: UUID.T): TaskEither<Errors.Adapter, Event[]>;
}
