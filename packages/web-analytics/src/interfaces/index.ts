import { Either } from "fp-ts/lib/Either";
import { UUID, Errors } from "@huckleberryai/core";
import { Logging, UseCases } from "../client";
import * as Server from "../server";

export type Event =
  | Logging.Event.T
  | UseCases.Loaded.Event.T
  | UseCases.Unloaded.Event.Normalized
  | Server.UseCases.HTTPAccess.Event.T;

export type Logger = (
  level: Logging.Level.T,
  message: string,
  tags: string[],
  parent?: UUID.T
) => void;

export interface Repository {
  save(id: UUID.T, event: Event): Promise<Either<Errors.Adapter.T, true>>;
  delete(id: UUID.T): Promise<Either<Errors.Adapter.T, true>>;
  get(id: UUID.T): Promise<Either<Errors.Adapter.T | Errors.NotFound.T, Event>>;
  getByCorrID(corr: UUID.T): Promise<Either<Errors.Adapter.T, Event[]>>;
}
