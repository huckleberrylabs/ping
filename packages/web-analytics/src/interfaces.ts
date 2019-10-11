import { Either } from "fp-ts/lib/Either";
import { UUID } from "@huckleberryai/core";
import { LogEvent, Loaded, Unloaded, LogLevel } from "./client";
import { HTTPAccess } from "./server";

export type Event = LogEvent | Loaded.Event | Unloaded.Event | HTTPAccess.Event;

export type Logger = (
  level: LogLevel,
  message: string,
  tags: string[],
  parent?: UUID
) => void;

export interface Repository {
  get(id: UUID): Promise<Either<Error, Event>>;
  getByCorrID(corrID: UUID): Promise<Event[]>;
}
