import { Either } from "fp-ts/lib/Either";
import { UUID } from "@huckleberryai/core";
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
  get(id: UUID.T): Promise<Either<Error, Event>>;
  getByCorrID(corr: UUID.T): Promise<Event[]>;
}
