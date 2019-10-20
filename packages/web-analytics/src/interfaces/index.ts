import { Either } from "fp-ts/lib/Either";
import { UUID, Errors } from "@huckleberryai/core";
import { Logging, UseCases } from "../client";
import * as Server from "../server";

export type Events =
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
  save(id: UUID.T, event: Events): Promise<Either<Errors.Adapter.T, null>>;
  remove(id: UUID.T): Promise<Either<Errors.Adapter.T, null>>;
  // get(id: UUID.T): Promise<Either<Errors.Adapter.T | Errors.NotFound.T, Event>>;
  // getByCorrID(corr: UUID.T): Promise<Either<Errors.Adapter.T, Event[]>>;
}

export interface SDK {
  log: Logger;
  unload: () => boolean;
}
